import Project from "../models/project.model.js";
import {
  createUniqueProjects,
  uploadToFirebase,
  sanitizeText,
} from "../utils/utils.js";

// Fetch and render portfolios
export const getPortfolios = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }).exec();
    const uniqueProjects = createUniqueProjects(projects);

    res.render("portfolios", {
      title: "Portfolios",
      haveAdditionalCss: true,
      projects: uniqueProjects,
    });
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch portfolios",
    });
  }
};

// Upload a new project
export const uploadProject = async (req, res) => {
  try {
    // Increase timeout for this request
    req.setTimeout(5 * 60 * 1000); // 5 minutes in milliseconds

    // Handle file uploads
    const imageUrls = await uploadToFirebase(req.files);

    // Validate and sanitize input
    const { projectName, projectDescription } = req.body;
    if (!projectName || !projectDescription) {
      return res.status(400).json({
        success: false,
        message: "Project name and description are required",
      });
    }

    const sanitizedProjectName = sanitizeText(projectName);
    const sanitizedProjectDescription = sanitizeText(projectDescription);

    // Create new project data
    const newProjectData = {
      ...req.body,
      projectName: sanitizedProjectName,
      projectDescription: sanitizedProjectDescription,
      projectImgUrls: imageUrls,
    };

    // Create project in database
    const newProject = await Project.create(newProjectData);
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Error uploading project:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to create project",
    });
  }
};
