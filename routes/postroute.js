const express = require("express");
const { PostModel } = require("../modules/postmodel");

const post = express.Router();

post.get("/",async(req,res)=>{
    try {
        let posts = await PostModel.find();
        res.status(200).send(posts)
    } catch (error) {
        console.log(error);
    }
})

post.post("/",async(req,res)=>{
    let {user,text,image,createdAt} = req.body;
    try {
       let newpost = new PostModel({user,text,image,createdAt,likes:[],comments:[]});
       await newpost.save();
       res.status(201).send("new Post Created Successfully");
    } catch (error) {
        console.log(error);
    }
})

post.patch("/:id",async(req,res)=>{
    let ID = req.params.id;
    let payload = req.body;
    try {
        await PostModel.findByIdAndUpdate({_id:ID},payload);
        res.status(204).send(`Post OF a ID ${ID} is Updated!`);
    } catch (error) {
        console.log(error);
    }
})

post.delete("/:id",async(req,res)=>{
    let ID = req.params.id;
    try {
        await PostModel.findByIdAndDelete({_id:ID});
        res.status(202).send(`Post OF a ID ${ID} is Deleted!`);
    } catch (error) {
        console.log(error);
    }
})

post.post("/:id/like",async(req,res)=>{
    let {user} = req.body;
    let ID = req.params.id;
    try {
        let obj = {_id : ID, User : user};
        let post = await PostModel.find({_id:ID});
        let likes = post[0].likes;
        likes.push(obj);
        await PostModel.findByIdAndUpdate({_id:ID},{likes:likes});
        res.status(201).send("Liked the Post");
    } catch (error) {
        console.log(error);
        
    }
})

post.post("/:id/comment",async(req,res)=>{
    let {user,text,createdAt} = req.body;
    let ID = req.params.id;
    try {
        let obj = {_id : ID, User : user,text,createdAt};
        let post = await PostModel.find({_id:ID});
        let comments = post[0].comments;
        comments.push(obj);
        await PostModel.findByIdAndUpdate({_id:ID},{comments:comments});
        res.status(201).send("Comment on the Post");
    } catch (error) {
        console.log(error);
        
    }
})

post.get("/:id",async(req,res)=>{
    let ID = req.params.id;
    try {
        let posts = await PostModel.find({_id:ID});
        res.status(200).send(posts)
    } catch (error) {
        console.log(error);
    }
})

module.exports={post};