import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

// Importing routes
import homeRouter from './routes/home.route.js';
import aboutRouter from './routes/about.route.js';
import contactRouter from './routes/contact.route.js';
import servicesRouter from './routes/services.route.js';
import portfoliosRouter from './routes/portfolios.route.js';
import blogRouter from './routes/blog.route.js';
import mailRouter from './routes/mail.route.js';
import authRouter from './routes/auth.router.js';

// Importing utilities
import { formatDateUtil, trimText } from './utils/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Make utilities available to all templates
app.locals.formatDateUtil = formatDateUtil;
app.locals.trimText = trimText;

// Middleware to parse JSON and URL-encoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_ATLAS_URI)
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.error('DB connection error:', err));

// Set up EJS as the template engine
app.set('view engine', 'ejs');

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up views directory
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', homeRouter);
app.use('/about', aboutRouter);
app.use('/services', servicesRouter);
app.use('/portfolios', portfoliosRouter);
app.use('/blog', blogRouter);
app.use('/contact', contactRouter);
app.use('/send-mail', mailRouter);
app.use('/auth', authRouter);

// Start server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
