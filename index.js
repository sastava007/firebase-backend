const express=require('express');
const bodyParser = require("body-parser");
const keys=require('./config/keys.json');
const auth=require('./api/auth');
const app=express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.use('/api',auth);

app.listen(keys.port,()=>{
    console.log(`Listening on port ${keys.port}`);
})