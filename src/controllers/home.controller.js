import Blog from "../models/blog.model.js";
import Project from "../models/project.model.js";
import { createUniqueProjects } from "../utils/utils.js";

export const home = async (req, res) => {
  try {
    const [projects, blogPosts] = await Promise.all([
      Project.find().sort({ createdAt: -1 }).exec(),
      Blog.find().populate("blogComments").exec(),
    ]);

    const uniqueProjects = createUniqueProjects(projects);

    res.render("index", {
      title: "Home Page",
      haveAdditionalCss: false,
      projects: uniqueProjects,
      blogPosts,
    });
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).send("An error occured while retrieving data.");
  }
};
