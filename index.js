const express=require('express');
const bodyParser = require("body-parser");
const keys=require('./config/keys.json');
const auth=require('./api/auth');
const comment=require('./api/comment');

const app=express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.use('/api/auth',auth);
app.use('/api/comment',comment);

app.listen(keys.port,()=>{
    console.log(`Listening on port ${keys.port}`);
})