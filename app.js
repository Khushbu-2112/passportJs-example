const express = require('express');

const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

const passport = require('passport');
require('./config/passport')(passport);

const db = require('./config/keys').MongoURI;

mongoose.connect(db,{ useNewUrlParser:true})
.then(()=>console.log('Mongodb connected'))
.catch(err =>console.log(err));

const expressLayouts = require('express-ejs-layouts');

const flash = require('connect-flash');
const session = require('express-session');

app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use(expressLayouts);
var path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended:false }));

app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

app.listen(port , console.log(`server started on ${port}`));
