import express from "express";
import { contact } from "../controllers/contact.controller.js";

const router = express.Router();

router.get("/", contact);

export default router;
