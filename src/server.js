import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import homeRouter from "./routes/home.route.js";
import aboutRouter from "./routes/about.route.js";
import contactRouter from "./routes/contact.route.js";
import servicesRouter from "./routes/services.route.js";
import portfoliosRouter from "./routes/portfolios.route.js";
import blogRouter from "./routes/blog.route.js";
import { formatDateUtil, trimText } from "./utils/utils.js";
import mailRouter from "./routes/mail.route.js";
import authRouter from "./routes/auth.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = 3000;

// Make formatDateUtil available to all templates
app.locals.formatDateUtil = formatDateUtil;
app.locals.trimText = trimText;

//Middleware to parse json and URL-encoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set a larger timeout value (e.g., 1 minutes)
// app.use((req, res, next) => {
//   req.setTimeout(1 * 60 * 1000); // 1 minutes in milliseconds
//   res.setTimeout(1 * 60 * 1000);
//   next();
// });

// Debugging middleware to log requests
// app.use((req, res, next) => {
//   console.log("Request URL:", req.originalUrl);
//   console.log("Request Method:", req.method);
//   console.log("Request Headers:", req.headers);
//   console.log("Request Body:", req.body);
//   next();
// });

mongoose
  .connect(process.env.MONGO_LOACL_URI)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

//set up EJS as the template engine
app.set("view engine", "ejs");

//serve static files froom public directory
app.use(express.static(path.join(__dirname, "public")));

//set up views directory
app.set("views", path.join(__dirname, "views"));

//root route
app.use("/", homeRouter);

//about route
app.use("/about", aboutRouter);

//services route
app.use("/services", servicesRouter);

//portfolios route
app.use("/portfolios", portfoliosRouter);

//blog route
app.use("/blog", blogRouter);

//contact route
app.use("/contact", contactRouter);

//mail route
app.use("/send-mail", mailRouter);

//auth route
app.use("/auth", authRouter);

//blog-detail route
app.route("/blog-details").get((req, res) => {
  res.render("blog-details");
});

app.listen(PORT, () => console.log("Server is running on port 3000"));
