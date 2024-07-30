import mongoose from "mongoose";

const projectSchema = mongoose.Schema({
    projectName: {
        type: String,
        required: true
    },
    aboutProject: {
        type: String,
        required: true
    },
    projectShortAbout: {
        type: String,
        required: true
    },
    projectLivePreviewLink: {
        type: String
    },
    projectCategory: {
        type: String,
        required: true
    },
    projectYear: {
        type: String,
        required: true
    },
    projectClient: {
        type: String
    },
    projectDesigner: {
        type: String
    },
    projectDescription: {
        type: String,
        required: true
    },
    projectStory: {
        type: String
    },
    projectApproach: {
        type: String
    },
    projectImgUrls: {
        type: Array
    }
})

const Project = mongoose.model('Project', projectSchema);

export default Project;