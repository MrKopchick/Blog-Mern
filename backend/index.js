import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';

import { loginValidation, registerValidation, postValidation } from './validations/index.js';
import { handleValidationErrors, checkAuth } from './utils/index.js';
import {UserController, PostController} from './controllers/index.js';


const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {  // исправлено
        cb(null, 'uploads'); 
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
});


const upload = multer({ storage });

app.use(express.json());
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
        url: `/upload/${req.file.originalname}`
    });
});

// POSTS
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts',checkAuth, postValidation, PostController.create);
app.delete('/posts/:id',checkAuth, PostController.remove);
app.patch('/posts', checkAuth, PostController.update);

// start server
app.listen(3002, () => { 
    try{
        console.log("server started (ノ^_^)ノ. port 3002");
    }catch(err){
        console.log(err);
    }
});