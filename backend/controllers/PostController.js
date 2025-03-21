import { text } from 'express'
import PostModel from '../models/PostModel.js'
import { ReturnDocument } from 'mongodb';

export const getAll = async (res, req) => {
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

export const getOne = async (res, req) => {
    try{
        const postId = req.params.id;   
        PostModel.findOneUpdate({
            id: postId,
        }, {
            $inc: {viewsCount: 1},
        },
        {
            ReturnDocument: 'after'
        },
        (err, doc) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    message: "невдалося отримати статтю"
                });
            }
            if(!doc){
                return res.status(404).json({
                    message: "стаття не знайдена",
                });
            }

            res.json(doc);
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "невдалося отримати всі статті"
        });
    }
};

export const remove = async (res, req) => {
    try{
        const postId = req.params.id;   
        PostModel.findOneAndDelete({
            _id: postId,
        },(err, doc) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    message: "невдалося видалити статтю"
                });
            }
            
            if(!doc){
                return res.status(404).json({
                    message: "стаття не знайдена",
                });
            }

            res.json({
                success: true,
            });
        });
    }catch(err){
    
    }
};

export const create = async (res, req) => {
    try{
        const document = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.body.user
        })

        const post = await document.save();

        res.json(post);
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "невдалося створити статтю"
        });
    }
};

export const update = async (res, req) => {
    try{
        const postId = req.params.id;   

        await PostModel.updateOne({
            id: postId,
        },
        {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
        });
        res.json({
            success: true,
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "невдалося оновити статтю"
        });
    }
};