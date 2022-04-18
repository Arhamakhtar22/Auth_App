const express = require('express');
const app = express();
const User = require('./models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');

mongoose.connect('mongodb://localhost:27017/authApp',{useNewUrlParser: true})
    .then(() => {
        console.log("MONGO CONNECTION OPEN")
    })
    .catch(err => {
        console.log("CONNECTION ERROR")
        console.log(err)
    })

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true}));
app.use(session({secret:'notagoodsecret'}));

const loginCheck = (req, res, next) =>{ //middleware to check if ur logged in
    if (req.session.user_id){
        next();
    } else {
        res.redirect('/login')
    }
}

app.get('/', (req, res) => {
    res.send('HOME PAGE');
})

app.get('/register', (req, res) =>{
    res.render('register')
})

app.post('/register', async (req, res) => {
    const { password, username } = req.body;
    const hash = await bcrypt.hash(password, 12); //hash the pass
    const user = new User({ //storing the hash pass in database
        username,
        hashedPassword: hash
    })
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/');
})

app.get('/login', (req, res) =>{
    res.render('login')
})

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username: username}); //check if we can find the username
    const valid = await bcrypt.compare(password, user.hashedPassword); //compare the pass entered w hashed pass
    if (valid) {
        req.session.user_id = user._id; //if u succesfully login we will store your userid in session
        res.redirect('/home');
    } else {
        res.redirect('/login');
    }
})

app.get('/home', loginCheck, (req, res) =>{
    res.render('home')
})

app.post('/logout', (req,res) =>{
    req.session.user_id = null;
    res.redirect('/login')
})

app.listen(3000, () => {
    console.log("SERVING YOUR APP!")
})
