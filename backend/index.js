import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';

import {loginValidaton, registerValidaton, postValidation} from './validations/index.js';
import { handleValidationErrors, checkAuth } from './utils/index.js';
import {UserController, PostController} from './controllers/index.js';


const app = express();

const storage = multer.diskStorage({
    destination: (_, _, cb) => {
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
    .then(()=>{console.log("монгос подключился. заебись")})
    .catch(err => {console.log("монгос отьебнулся " + err)});
    
// AUTH
app.post ('/auth/login',  loginValidaton, handleValidationErrors,UserController.login);
app.post ('/auth/register',  registerValidaton, handleValidationErrors, UserController.register);
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
        console.log("сервер заработал (ノ^_^)ノ. порт 3002");
    }catch(err){
        console.log(err);
    }
});