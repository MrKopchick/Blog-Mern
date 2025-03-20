import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());

// connect to db
mongoose
    .connect('mongodb+srv://illya:12345678Admin@cluster0.podna.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(()=>{console.log("монгос подключился. заебись")})
    .catch(err => {console.log("монгос отьебнулся" + err)});

    

app.listen(3001, () => { 
    try{
        console.log("сервер заебись");
    }catch(err){
        console.log("пизда...:" + err);
    }
});