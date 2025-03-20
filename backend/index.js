import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { registerValidaton } from './validations/auth.js';
import { check, validationResult } from 'express-validator';
import UserModel from './models/user.js';
import checkAuth from './utils/checkAuth.js';

const app = express();
app.use(express.json());

// connect to db
mongoose
    .connect('mongodb+srv://illya:12345678Admin@cluster0.podna.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
    .then(()=>{console.log("монгос подключился. заебись")})
    .catch(err => {console.log("монгос отьебнулся " + err)});

// registration
app.post ('/auth/register', registerValidaton, async (req, res) => {
    try{
        const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    const document = new UserModel({
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash: hash
    });

    const user = await document.save();
    const token = jwt.sign({id: user._id}, 'secret123', { expiresIn: '30d'});

    const {passwordHash, ...userData} = user._doc;
    res.json({
        ...userData,
        token
    })

    }catch(err){
        res.status(500).json({
            message: 'не вдалося зареєструватися. Щось не так з введеними даними',
        });
        console.log(("у какогото долбойоба нехватило мозгов чтобы зарегистрировать себя"));
    }
});

// login
app.post ('/auth/login', async (req, res) => {
    try{
        const user = await UserModel.findOne({email: req.body.email});
        if(!user){
            console.log(`у какого то долбойоба не нашлась почта`);
            return res.status(404).json({
               message: 'Користувача не найдено' 
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user.passwordHash);

        if(!isValidPass){
            console.log(`у какого то долбойоба не нашелся пароль`);
            return res.status(403).json({
                message: `невірний логін або пароль`
            })
        }

        const token = jwt.sign({id: user._id}, 'secret123', { expiresIn: '30d'});

        const {passwordHash, ...userData} = user._doc;
        res.json({
            ...userData,
            token
        });
    }catch(err){
        res.status(500).json({
            message: 'не вдалося авторизуватися. Щось не так з введеними даними',
        });
        console.log(("У какогото долбойоба нехватило мозгов чтобы авторизовать себя"));
    }
});

// get me
app.get('/auth/me', checkAuth , async (req, res) => {
    try{
        res.json({
            status: 'ok'
        });
    }catch{
        res.status(500).json({
            message: 'іди заріжся свиня',
        });
    }
});

app.listen(3002, () => { 
    try{
        console.log("сервер заработал. заебись");
    }catch(err){
        console.log("пизда...:" + err);
    }
});