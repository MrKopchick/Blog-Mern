import express from 'express';
import mongoose from 'mongoose';
import { registerValidaton } from './validations/auth.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js';

const app = express();
app.use(express.json());

// connect to db
mongoose
    .connect('mongodb+srv://illya:12345678Admin@cluster0.podna.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
    .then(()=>{console.log("монгос подключился. заебись")})
    .catch(err => {console.log("монгос отьебнулся " + err)});


// AUTH

// login
app.post ('/auth/login', UserController.login);
// registration
app.post ('/auth/register', registerValidaton, UserController.register);
// get me
app.get('/auth/me', checkAuth , UserController.getMe);


// start server
app.listen(3002, () => { 
    try{
        console.log("сервер заработал. заебись");
    }catch(err){
        console.log("пизда...:" + err);
    }
});