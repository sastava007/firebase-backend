const express=require('express');
const router=express.Router();
const firebase=require('../modules/firebase');

const database = firebase.database();
const Users=database.ref().child("Users");

router.post('/register',(req,res)=>{
    firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password)
    .catch((err)=>{
      console.log(err.message);
    });

      firebase.auth().onAuthStateChanged((user) =>{
        if(user)
        {
          console.log(user.uid);
          Users.push({"name":req.body.name, "age":req.body.age})
            .once('value',(user)=>{ 
              console.log(user.val());
              res.status(200).send(user.val());
            });
        }
    });
})


module.exports=router;