const express = require("express");
const {UserModel} = require("../modules/usermodel.js");
const bcrypt = require("bcrypt");

const user = express.Router();


user.get("/",async(req,res)=>{
    try {
        let users = await UserModel.find();
        res.status(200).send(users);
    } catch (error) {
        console.log(error);
    }
})

user.post("/register",async(req,res)=>{
    let {name, email, password, dob, bio} = req.body;
    let user = await UserModel.find({email});
    if(user.length>0){
        res.status(200).send("User With this Email Already Exist!");
    }else{
        if(!name || !email || !password || !dob || !bio){
            res.status(400).send("Please Fill all the Fields!");
        }else{
            bcrypt.hash(password,5,async(err,hash)=>{
                if(err){
                    console.log(err);
                }else{
                    let newuser = await UserModel({name,email,password:hash,dob,bio,posts:[],friends:[],friendRequests:[]});
                    await newuser.save();
                    res.status(201).send("User Register Successfully!");
                }
            })
        }
    }

})

user.get("/:id/friends",async(req,res)=>{
    let ID = req.params.id;
    try {
        let user = await UserModel.find({_id:ID});
        let friendslist =  user[0].friends;
        // console.log(friendslist,user);
        res.status(200).send(friendslist);
    } catch (error) {
        console.log(error);
    }
})

user.post("/:id/friends",async(req,res)=>{
    let ID = req.params.id;
    try {
        let {friendID} = req.body;
        let friend = await UserModel.find({_id:friendID});
        let friendFR = friend[0].friendRequests;
        let obj ={
            requestreceiveid : friendFR.length+1,
            FriendreceiceID : ID
        }
        friendFR.push(obj);
        await UserModel.findByIdAndUpdate({_id:friendID},{friendRequests:friendFR});
        let user = await UserModel.find({_id:ID});
        let userFR = user[0].friendRequests;
        let obj2 = {
            requestsendid : userFR.length+1,
              FriendsendID : friendID
        }
        userFR.push(obj2);
        await UserModel.findByIdAndUpdate({_id:ID},{friendRequests:userFR});
        // console.log(friendFR,userFR);
        res.status(201).send("Friend Request Send Successfully!");
    } catch (error) {
        console.log(error)
        
    }
})

user.patch("/:id/friends/:friendid",async(req,res)=>{
    try {
        let {status} = req.body;
        let ID = req.params.id;
        let fID = req.params.friendid;
        let user = await UserModel.find({_id:ID});
        let friend = await UserModel.find({_id:fID});
       let addtofriend = user[0].friendRequests.filter((element)=>{
                  if(element.FriendreceiceID===fID){
                    return element;
                  }
        })
        let newaddeduser = user[0].friends;
        newaddeduser.push(addtofriend[0]);
        let addtofriend2 = friend[0].friendRequests.filter((element)=>{
            if(element.FriendreceiceID===fID){
              return element;
            }
  })
        let newaddeduser2 = friend[0].friends;
        newaddeduser.push(addtofriend2[0]);
        let removefromrequest = user[0].friendRequests.filter((element)=>{
            if(element.FriendreceiceID!==fID){
              return element;
            }
            
        })
  let removefromrequest2 = friend[0].friendRequests.filter((element)=>{
    if(element.FriendsendID!==fID){
      return element;
    }
     })
        console.log(addtofriend);
        if(status==="accept"){
            user[0].friends.push(addtofriend[0]);
            await UserModel.findByIdAndUpdate({_id:ID},{friends:newaddeduser,friendRequests:removefromrequest});
            
            await UserModel.findByIdAndUpdate({_id:fID},{friends:newaddeduser2,friendRequests:removefromrequest2});
            res.status(204).send("Friend Request accepted and Friend added to Friend List");
        }else{
            await UserModel.findByIdAndUpdate({_id:ID},{friendRequests:removefromrequest});
            await UserModel.findByIdAndUpdate({_id:fID},{friendRequests:removefromrequest2});
            res.status(200).send("Friend requrest is rejected");
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports={user};