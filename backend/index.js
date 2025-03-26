import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import cors from 'cors';
import fs from 'fs';

import { loginValidation, registerValidation, postValidation } from './validations/index.js';
import { handleValidationErrors, checkAuth } from './utils/index.js';
import {UserController, PostController} from './controllers/index.js';

import dotenv from 'dotenv';


dotenv.config();

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});


const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// connect to db
mongoose
    .connect('mongodb+srv://illya:12345678Admin@cluster0.podna.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
    .then(()=>{console.log("mongodb connected: (ノ^_^)ノ")})
    .catch(err => {console.log("bruh mongo: " + err)});
    
// AUTH
app.post ('/auth/login',  loginValidation, handleValidationErrors,UserController.login);
app.post ('/auth/register',  registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth , UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
      url: `/uploads/${req.file.originalname}`,
    });
});

// POSTS
app.get('/tags', PostController.getLastTags); // ok
app.get('/posts', PostController.getAll); //fixed, ok
app.get('/posts/tags', PostController.getLastTags); // ok
app.get('/posts/:id', PostController.getOne); // fixed, ok
app.post('/posts',checkAuth, postValidation, PostController.create); // fixed, ok
app.delete('/posts/:id',checkAuth, PostController.remove); // fixed, ok
app.patch('/posts', checkAuth, PostController.update); // ok

// start server
app.listen(3002, () => { 
    try{
        console.log("server started (ノ^_^)ノ. port 3002");
    }catch(err){
        console.log(err);
    }
});