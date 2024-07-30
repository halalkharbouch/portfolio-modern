import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
  {
    commentAuthor: {
      type: String,
    },
    commentAuthorEmail: {
        type: String
    },
    commentAuthorWebsite: {
        type: String
    },
    commentText: {
      type: String,
      required: true,
    },
    commentDate: {
      type: String,
    },
    commentReplies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reply",
      },
    ],
    parentBlog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
