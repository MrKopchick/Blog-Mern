import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';


export const register = async (req, res) => {
    try{
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
        const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '30d' });

        const {passwordHash, ...userData} = user._doc;
        res.json({
            ...userData,
            token
        });
    }catch(err){
        res.status(500).json({
            message: 'не вдалося зареєструватися. Щось не так з введеними даними',
        });
    }
};

export const login = async (req, res) => {
    try{
        const user = await UserModel.findOne({email: req.body.email});
        if(!user){
            return res.status(404).json({
               message: 'Користувача не найдено' 
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user.passwordHash);

        if(!isValidPass){
            return res.status(403).json({
                message: `невірний логін або пароль`
            })
        }

        const token = jwt.sign({ _id: user._id }, 'secret', { expiresIn: '30d' });

        const {passwordHash, ...userData} = user._doc;
        res.json({
            ...userData,
            token
        });
    }catch(err){
        res.status(500).json({
            message: 'не вдалося авторизуватися. Щось не так з введеними даними',
        });
    }
};

export const getMe = async (req, res) => {
    try{
        const user = await UserModel.findById(req.userId);

        if(!user){
            return res.status(404).json({
                message: 'Користувача не знайдено'
            });
        }

        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData,
        });
    }catch(err){
        res.status(500).json({
            message: 'немає доступу',
        });
    }
}