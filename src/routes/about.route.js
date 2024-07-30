import express from "express";
import { about } from "../controllers/about.controller.js";

const router = express.Router();

router.get("/", about);

export default router;
