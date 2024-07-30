import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
    },
    blogDate: {
      type: String
    },
    blogKeyPoints: {
      type: Array
    },
    blogConclusion: {
      type: String
    },
    blogTitle: {
      type: String,
      required: true,
    },
    blogBody: {
      type: String,
      required: true,
    },
    blogType: {
      type: String
    },
    blogCategory: {
      type: String,
      required: true,
    },
    blogTags: {
      type: Array,
    },
    blogImgUrls: {
      type: Array
    },
    blogComments: [{
      type:mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }]
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
