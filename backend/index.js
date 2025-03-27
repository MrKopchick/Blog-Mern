import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import cors from 'cors';
import fs from 'fs';
import dotenv from 'dotenv';
import chalk from 'chalk';

import { loginValidation, registerValidation, postValidation } from './validations/index.js';
import { handleValidationErrors, checkAuth } from './utils/index.js';
import { UserController, PostController } from './controllers/index.js';

dotenv.config();

const app = express();
const PORT = 3002;
const UPLOADS_DIR = 'uploads';
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://illya:12345678Admin@cluster0.podna.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0';

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync(UPLOADS_DIR)) {
            fs.mkdirSync(UPLOADS_DIR);
        }
        cb(null, UPLOADS_DIR);
    },
    filename: (_, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage });

// Middleware
app.use(express.json());
app.use(cors());
app.use(`/${UPLOADS_DIR}`, express.static(UPLOADS_DIR));

// Database Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log(chalk.blue("SERVER | MongoDB connected: \n\n\t\t\t" + chalk.green('\\{^_^}/ hi!'))))
    .catch(err => console.error(chalk.red("SERVER | MongoDB connection error:"), err));

// Auth Routes
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

// File Upload Route
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({ url: `/${UPLOADS_DIR}/${req.file.originalname}` });
});

// Post Routes
app.get('/tags', PostController.getLastTags);
app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postValidation, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts', checkAuth, PostController.update);

// Start Server
app.listen(PORT, () => {
    console.log(chalk.blue("SERVER | Server started successfully! ") + chalk.green("(ノ^_^)ノ"));
    console.log(chalk.blue("SERVER | Listening on port:") + chalk.yellow(PORT));
    console.log(chalk.blue("SERVER | Resources:"));
    console.log(chalk.blue("SERVER | ") + chalk.cyan("http://localhost:" + PORT + "/posts"));
    console.log(chalk.blue("SERVER | ") + chalk.cyan("http://localhost:" + PORT + "/tags"));
    console.log(chalk.blue("SERVER | ") + chalk.cyan("http://localhost:" + PORT + "/auth/me"));
    console.log(chalk.blue("SERVER | Home: ") + chalk.cyan("http://localhost:" + PORT));
});