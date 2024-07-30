import { getStorage, uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { app } from "../firebase.js";
import { format, formatDistanceToNow, subDays } from "date-fns";
import Blog from "../models/blog.model.js";

//upload files to firebase function
export const uploadToFirebase = async (files) => {
  const uploadPromises = files.map(async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.originalname;
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, file.buffer);
    console.log("uploading....: " + file.originalname);
    return await getDownloadURL(storageRef);
  });
  return await Promise.all(uploadPromises);
};

//function to format date am using this function to display formatted date in blogs, comments and replies
export const formatDateUtil = (date) => {
  const now = new Date();
  const dateToFormat = new Date(date);

  const daysDifference = (now - dateToFormat) / (1000 * 60 * 60 * 24);

  if (daysDifference < 1) {
    return formatDistanceToNow(dateToFormat, { addSuffix: true });
  } else if (daysDifference < 3) {
    return `${Math.floor(daysDifference)} days ago`;
  } else {
    return format(dateToFormat, "MMMM d, yyyy");
  }
};

//function to trim text this is been used to show trimmed blogBody
export const trimText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

//function to fetch blogs by tags from db
export const getBlogsByTags = async () => {
  const financeBlogs = await Blog.find({ blogTags: "Finance" });
  const itSupportBlogs = await Blog.find({ blogTags: "IT Support" });
  const webDevBlogs = await Blog.find({ blogTags: "Web Development" });
  const businessBlogs = await Blog.find({ blogTags: "Business" });
  const printing3DBlogs = await Blog.find({ blogTags: "3D Printing" });

  return {
    financeBlogs,
    itSupportBlogs,
    webDevBlogs,
    businessBlogs,
    printing3DBlogs,
  };
};

//function to create unique projects
export const createUniqueProjects = (projects) => {
  return Array.from(new Set(projects.map((p) => p._id.toString()))).map((id) =>
    projects.find((p) => p._id.toString() === id)
  );
};

//function to remove html tags from text
export const sanitizeHTML = (input) => {
  return input.replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML tags
};

//function to escape single and double quotes from text
export const sanitizeSQL = (input) => {
  return input.replace(/'/g, "\\'").replace(/"/g, '\\"'); // Escape single and double quotes
};

//function to allow alphanumeric characters only in username
export const sanitizeUsername = (username) => {
  return username.replace(/[^a-zA-Z0-9_]/g, ""); // Allow only alphanumeric characters and underscores
};

//function to validate email
export const sanitizeEmail = (email) => {
  // Simple regex to validate basic email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? email : ""; // Return email if valid, otherwise return empty string
};

//function validate url
export const sanitizeURL = (url) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.href;
  } catch (error) {
    return ""; // Return empty string if URL is invalid
  }
};

//function to sanitize text and remove potential harmful characters
export const sanitizeText = (text) => {
  return text
    .replace(/[<>]/g, "")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const sanitizeInputObject = (input) => {
  if (!input || typeof input !== "object") return input;

  return Object.keys(input).reduce((sanitized, key) => {
    let value = input[key];

    if (typeof value === "string") {
      value = sanitizeText(value); // Sanitize strings
    } else if (Array.isArray(value)) {
      value = value.map((item) => sanitizeInputObject(item)); // Recursively sanitize arrays
    } else if (typeof value === "object") {
      value = sanitizeInputObject(value); // Recursively sanitize objects
    }

    sanitized[key] = value;
    return sanitized;
  }, {});
};
