const express = require('express');

const router = express.Router();

const User = require('../models/User');

const bcrypt = require('bcryptjs');

const passport = require('passport');

router.get('/login',(req,res)=>{
    res.render('login');
});

router.get('/register',(req,res)=>{
    res.render('register');
});

router.post('/register',(req,res)=>{
   const { name,email,password,password2} = req.body;

   let errors =[];
   if(!email || !name ||!password || !password2){
       errors.push({msg:'please fill all fields'});
   }
    if(password2 !== password)
        errors.push({msg:'passeord not matched'});

    if(password.length <6)
        errors.push({msg:'Password should contain at least 6 char'});

    if(errors.length > 0)
    {
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        }) ;
    }
    else   
    {
        User.findOne({email:email})
        .then(user => { 
            if(user){
                errors.push({msg:'Email is already registered'});
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                }) ;
            }
            else{
                let date =  Date('2020-05-12');
                const newUser = new User({name,email,password,date});
                
                bcrypt.genSalt(10,(err,salt)=>bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                    .then(user =>{
                        req.flash('success_msg','You are now registered and you can login.')
                        res.redirect('/users/login');
                    })
                    .catch(err=>console.log(err));
                }))

            }
        });
    }

});

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);
});

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
});

module.exports  = router;