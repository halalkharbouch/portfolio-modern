import express from "express";
import { sendMail } from "../controllers/mail.controller.js";

const router = express.Router();

router.post("/", sendMail);

export default router;
