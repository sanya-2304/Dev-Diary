const { Schema, model } = require('mongoose');

const commentSchema=new Schema({
    content:{
        type:String,
        required:true
    }, createdBy:{
        type:Schema.Types.ObjectId,
       ref:"user"
    }, blogId:{
        type:Schema.Types.ObjectId,
       ref:"blog"
    }
}, 
{timestamps:true})

const commentModel=model('comment', commentSchema);

module.exports=commentModel;