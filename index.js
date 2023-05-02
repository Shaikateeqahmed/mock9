const express = require("express");
const {connection } = require("./config/connection.js");
const {user} = require("./routes/userroute.js");
const {post} = require("./routes/postroute.js");
require("dotenv").config();


const app = express();
app.use(express.json());
app.use("/users",user);
app.use("/posts",post);


app.listen(process.env.port,async()=>{
    await connection;
    console.log(`Server is Running on Post 3000`);
})