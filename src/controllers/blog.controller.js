import { limit } from "firebase/firestore";
import Blog from "../models/blog.model.js";
import Comment from "../models/comment.model.js";
import Reply from "../models/reply.model.js";
import {
  getBlogsByTags,
  uploadToFirebase,
  sanitizeHTML,
  sanitizeText,
  sanitizeUsername,
  sanitizeEmail,
  formatDateUtil,
} from "../utils/utils.js";

export const getBlogs = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const LIMIT = 10;
  const tag = req.query.tag || "";
  const searchTerm = req.query.q || "";

  try {
    const query = {};

    if (searchTerm) {
      query.blogTitle = { $regex: searchTerm, $options: "i" };
    }

    if (tag) {
      query.blogTags = tag;
    }

    const totalBlogs = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalBlogs / LIMIT);

    const allPosts = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * LIMIT)
      .limit(LIMIT)
      .exec();

    const blogByTags = await getBlogsByTags();

    res.render("blog", {
      title: "Blog",
      haveAdditionalCss: true,
      allPosts,
      currentPage: page,
      totalPages,
      blogByTags,
      selectedTag: tag,
      searchTerm,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error: Unable to fetch blogs");
  }
};

export const getBlog = async (req, res) => {
  const { blogId } = req.params;

  try {
    const blogPost = await Blog.findById(blogId)
      .populate({
        path: "blogComments",
        populate: {
          path: "commentReplies",
          model: "Reply",
        },
      })
      .exec();

    if (!blogPost) {
      return res.status(404).send("Blog Post not found");
    }

    const allPosts = await Blog.find().sort({ createdAt: -1 }).exec();
    const currentIndex = allPosts.findIndex(
      (blog) => blog._id.toString() === blogId
    );

    const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
    const nextPost =
      currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
    const recentPosts = allPosts.slice(0, 3);

    const blogByTags = await getBlogsByTags();

    res.render("blog-details", {
      title: "Post Details",
      haveAdditionalCss: true,
      post: blogPost,
      nextPost,
      previousPost,
      recentPosts,
      blogByTags,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while retrieving the blog post");
  }
};

export const createBlogPost = async (req, res) => {
  try {
    // Validate request body
    const { blogTitle, blogBody, ...otherFields } = req.body;

    if (!blogTitle || !blogBody) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    // Upload images to Firebase
    const urls = await uploadToFirebase(req.files);

    // Create blog data
    const blogData = {
      ...req.body,
      blogImgUrls: urls,
    };

    // Create blog post
    console.log("Creating Blog Post...");
    const blogPost = await Blog.create(blogData);

    // Send response
    return res.status(201).json(blogPost);
  } catch (error) {
    console.error("Error creating blog post:", error.message);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the blog post" });
  }
};

export const createComment = async (req, res) => {
  const { blogId } = req.params;
  const { commentText, commentAuthor } = req.body; // Destructure necessary fields

  // Validate and sanitize input
  if (!commentText || !commentAuthor) {
    return res.status(400).json({ error: "Content and author are required" });
  }

  const sanitizedContent = sanitizeHTML(commentText); // Sanitize HTML in content
  const sanitizedAuthor = sanitizeUsername(commentAuthor); // Sanitize author names

  const newCommentData = {
    commentText: sanitizedContent,
    commentAuthor: sanitizedAuthor,
    parentBlog: blogId,
  };

  try {
    console.log("Creating comment");
    const comment = await Comment.create(newCommentData);

    await Blog.findByIdAndUpdate(blogId, {
      $push: { blogComments: comment._id },
    });

    const formattedComment = {
      ...comment._doc,
      formattedDate: formatDateUtil(comment.createdAt),
    };

    return res.status(201).json(formattedComment);
  } catch (error) {
    console.error("Error creating comment:", error.message);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the comment" });
  }
};

export const createReply = async (req, res) => {
  console.log("Creating reply");
  const { commentId } = req.params;
  const { replyBody, replyAuthor } = req.body; // Destructure necessary fields

  // Validate input
  if (!replyBody || !replyAuthor) {
    return res.status(400).json({ error: "Content and author are required" });
  }

  // Sanitize input
  const sanitizedContent = sanitizeText(replyBody); // Sanitize content
  const sanitizedAuthor = sanitizeText(replyAuthor); // Sanitize author

  const newReplyData = {
    replyBody: sanitizedContent,
    replyAuthor: sanitizedAuthor,
    parentComment: commentId,
  };

  try {
    // Create the reply
    const reply = await Reply.create(newReplyData);

    // Update the comment with the new reply
    await Comment.findByIdAndUpdate(commentId, {
      $push: { commentReplies: reply._id },
    });

    // Send a successful response with the created reply
    return res.status(201).json({
      message: "Reply created successfully",
      reply,
    });
  } catch (error) {
    console.error("Error creating reply:", error.message);
    // Send a server error response
    return res.status(500).json({
      error: "An error occurred while creating the reply",
      details: error.message,
    });
  }
};
