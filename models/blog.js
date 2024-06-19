const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const blogSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    coverImgURL:{
        type:String,
        required:false
    },
    createdBy:{
       type:Schema.Types.ObjectId,
       ref:"user"
    },
}, {
    timestamps:true
})

const BlogModel=model('blog', blogSchema);

module.exports=BlogModel