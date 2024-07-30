import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { sanitizeText } from "../utils/utils.js";

dotenv.config();

export const sendMail = async (req, res) => {
  const { firstName, lastName, email, phone, service, message } = req.body;

  // Validate input
  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  // Sanitize input
  const sanitizedFirstName = sanitizeText(firstName);
  const sanitizedLastName = sanitizeText(lastName);
  const sanitizedEmail = sanitizeText(email);
  const sanitizedPhone = sanitizeText(phone);
  const sanitizedService = sanitizeText(service);
  const sanitizedMessage = sanitizeText(message);

  const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f9;
                color: #333;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .header {
                background-color: #8750f7;
                color: #fff;
                padding: 10px 20px;
                border-radius: 8px 8px 0 0;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
            }
            .content {
                padding: 20px;
            }
            .content h2 {
                color: #2400ff;
                font-size: 20px;
                margin-top: 0;
            }
            .content p {
                margin: 10px 0;
            }
            .content .label {
                color: #2a1454;
                font-weight: bold;
            }
            .footer {
                text-align: center;
                padding: 10px;
                background-color: #9b8dff;
                color: #fff;
                border-radius: 0 0 8px 8px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>New Contact Form Submission</h1>
            </div>
            <div class="content">
                <h2>Contact Details</h2>
                <p><span class="label">Name:</span> ${sanitizedFirstName} ${sanitizedLastName}</p>
                <p><span class="label">Email:</span> ${sanitizedEmail}</p>
                <p><span class="label">Phone Number:</span> ${sanitizedPhone}</p>
                <p><span class="label">Service:</span> ${sanitizedService}</p>
                <h2>Message</h2>
                <p>${sanitizedMessage}</p>
            </div>
            <div class="footer">
                <p>Message from www.halalsolutionsng.com</p>
            </div>
        </div>
    </body>
    </html>
  `;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: sanitizedEmail,
    to: process.env.MAIL_TO,
    subject: `Contact Form Submission from ${sanitizedFirstName} ${sanitizedLastName}`,
    text: sanitizedMessage,
    html: emailHtml,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Server error: Unable to send message",
      error: error.message,
    });
  }
};
