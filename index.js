const express=require('express')
require('dotenv').config();
const path=require('path')
const mongoose=require('mongoose')
const cookieParser=require('cookie-parser');
const { checkForAuthCookie } = require('./middlewares/authentication');

const BlogModel=require('./models/blog')

const userRoutes=require('./routes/user')
const blogRoutes=require('./routes/blog')

const app=express();
const PORT=process.env.PORT || 1801;

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'))

mongoose.connect('mongodb://127.0.0.1:27017/blog-db').then(() => console.log('DB connected!'))
.catch(err => console.error('DB connection error:', err));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve('./public')));
app.use(checkForAuthCookie('token'));

app.get('/', async (req, res)=>{
    const allBlogs=await BlogModel.find({}).populate('createdBy');
res.render('home',{
    user:req.user,
    blogs:allBlogs
})
})
app.use('/user', userRoutes)
app.use('/blog', blogRoutes)
app.listen(PORT, ()=>{
    console.log(`Server running fine at ${PORT} PORT.`)
})