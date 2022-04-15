const express = require('express');
const app = express();
const User = require('./models/user');

app.get('/secert', (req, res) =>{
    res.send('THIS IS SECERT!')
})

app.listen(3000, () => {
    console.log("SERVING YOUR APP!")
})