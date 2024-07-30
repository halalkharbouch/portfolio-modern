import express from "express";
import { showServices } from "../controllers/services.controller.js";

const router = express.Router();

router.get("/", showServices)

export default router
