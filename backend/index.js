import express from 'express';
import mongoose from 'mongoose';

import { registerValidaton, loginValidaton } from './validations/authValidations.js';
import { postCreateValidation } from './validations/postValidations.js';

import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

import checkAuth from './utils/checkAuth.js';

const app = express();
app.use(express.json());

// connect to db
mongoose
    .connect('mongodb+srv://illya:12345678Admin@cluster0.podna.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
    .then(()=>{console.log("монгос подключился. заебись")})
    .catch(err => {console.log("монгос отьебнулся " + err)});


    
    
// AUTH
app.post ('/auth/login', loginValidaton, UserController.login);
app.post ('/auth/register', registerValidaton, UserController.register);
app.get('/auth/me', checkAuth , UserController.getMe);

// POSTS
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts',checkAuth, postCreateValidation, PostController.create);
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