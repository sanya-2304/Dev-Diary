const express=require('express')
const router=express.Router();
const BlogModel=require('../models/blog')
const multer=require('multer')
const path=require('path')
const commentModel=require('../models/comment')

const storage=multer.diskStorage({
    destination:function(req, file, cb){
        cb(null , path.resolve('./public/uploads'))
    }, filename:function(req, file, cb){
        const fileName=`${Date.now()}-${file.originalname}`;
        cb(null, fileName)
    }
})

const upload=multer({storage: storage});  //upload instance

router.get('/addBlog', (req,res)=>{
    return res.render('AddBlog',{
        user:req.user
    })
})
router.post('/', upload.single('covimg'), async(req,res)=>{
    const {title, body, }=req.body;
    const blog=await BlogModel.create({
        body, title, 
        createdBy:req.user._id, 
        // coverImgURL:`/uploads/${req.file.fileName}`
    })
    return res.redirect(`/blog/${blog._id}`)
})


router.post('/comment/:blogId', async(req, res)=>{
    await commentModel.create({
        content:req.body.content, 
        blogId:req.params.blogId,
        createdBy:req.user._id
    })
    return res.redirect(`/blog/${req.params.blogId}`)
})

router.get('/:id',async (req,res)=>{
    const blog=await BlogModel.findById(req.params.id).populate("createdBy")
    const comments=await commentModel.find({blogId:req.params.id}).populate("createdBy")
    console.log('blog',blog)
    return res.render('blog', {
        blog:blog,
        user:req.user,
        comments
    })
})

module.exports=router;