const express=require('express');
const router=express.Router();
const keys=require('../config/keys.json');
const firebase=require('firebase');

const config={
  apiKey: keys.apiKey,
  authDomain: keys.authDomain,
  databaseURL: keys.databaseURL,
  storageBucket: keys.storageBucket,
  messagingSenderId: keys.messagingSenderId,
}

firebase.initializeApp(config);
const database = firebase.database();

const Users=database.ref().child("Users");
const Comments=database.ref().child("Comments");

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


router.post('/addComment',(req,res)=>{

  const newComment={
    slug:req.body.slug,
    desc:req.body.desc,
    children:[]
  };
  // const cId=Comments.push(newComment).getKey();
  const parentId=req.body.parentId; 

  //if it is root comment then no need to insert in it's parent comment
  if(req.body.root===false)
  {
    Comments.child(parentId).update({"name":"Shivansh"});
  }

  Comments.once('value',(comment)=>{
    console.log(comment.val());
    res.status(400).send(comment.val());
  });

})


module.exports=router;