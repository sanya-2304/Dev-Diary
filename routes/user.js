const express=require('express')
const userModel=require('../models/user')
const router=express.Router();

// const cookieParser = require('cookie-parser');


router.get('/signIn', (req, res)=>{
    res.render('signIn')
})
router.get('/signUp', (req, res)=>{
    res.render('signUp')
})

router.post('/signUp', async(req, res)=>{
    const {fullName, email, password}=req.body;
    try{
    await userModel.create({
        fullName, email, password
    })
    return res.redirect('/') }
    catch(err){
        console.error(err);
        res.status(500).send('error creating user')
    }
})
// router.use(cookieParser());
router.post('/signIn', async (req, res)=>{
    const { email, password } = req.body;
    try {
        const token = await userModel.matchPasswordAndCreateToken(email, password);
        // console.log('Logged in user and the token is:', token);
        
        return res.cookie('token', token).redirect('/');
    } catch (error) {
        console.log('error is', error)
        res.render('signIn', {
            error:'Incorrect email or password'
        })  
    }
})

router.get('/logout', (req,res)=>{
    //cookie clear krke redirect kardo login pe

    res.clearCookie('token').redirect('/')
})
module.exports=router