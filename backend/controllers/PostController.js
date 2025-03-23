import PostModel from '../models/Post.js'
import UserModel from "../models/User.js";

export const getAll = async (req, res) => {
    try{
        const posts = await PostModel.find().populate('user').exec();
        res.json(posts);
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "невдалося отримати всі статті"
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await PostModel.findByIdAndUpdate(
            postId,
            { $inc: { viewsCount: 1 } },
            { new: true }
        ).populate("user");

        if (!post) {
            return res.status(404).json({ message: "Стаття не знайдена" });
        }

        res.json(post);
    } catch (err) {
        console.error("Помилка отримання статті:", err);
        res.status(500).json({ message: "Невдалося отримати статтю" });
    }
};


export const remove = async (req, res) => {
    try {
        const postId = req.params.id;   

        const doc = await PostModel.findOneAndDelete({ _id: postId });

        if (!doc) {
            return res.status(404).json({ message: "Стаття не знайдена" });
        }

        res.json({ success: true });
    } catch (err) {
        console.error("delete error:", err);
        res.status(500).json({ message: "Не вдалося видалити статтю" });
    }
};


export const create = async (req, res) => {
    try{
        console.log("req.userId:", req.userId);
        const userExists = await UserModel.findById(req.userId);
        console.log("Токен:", req.headers.authorization);
        console.log("req.userId:", req.userId);

        if (!userExists) {
            return res.status(404).json({ message: "Користувач не знайдений" });
        }
        if (!req.userId) {
            return res.status(401).json({ message: "Користувач не авторизований" });
        }
        const document = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        })

        const post = await document.save();

        return res.json(post);

    }catch(err){
        console.log(err);
        return  res.status(500).json({
            message: "невдалося створити статтю"
        });
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = (({ title, text, imageUrl, tags }) => ({ title, text, imageUrl, tags }))(req.body);
        
        const result = await PostModel.updateOne({ id }, updateData);
        
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Статтю не знайдено" });
        }
        
        res.json({ success: true });
    } catch (err) {
        console.error("Помилка оновлення:", err);
        res.status(500).json({ message: "Не вдалося оновити статтю" });
    }
};
