const mongoose = require("mongoose");
const postSchema = mongoose.Schema({
    user : String,
    text : String,
    image : String,
    createdAT : Date,
    likes : Array,
    comments : Array
})

const PostModel = mongoose.model("post",postSchema);

module.exports={PostModel};