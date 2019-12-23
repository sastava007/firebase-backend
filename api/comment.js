const express=require('express');
const router=express.Router();
const firebase=require('../modules/firebase');

const database = firebase.database();
const Comments=database.ref().child("Comments");

router.post('/addComment',(req,res)=>{

    const newComment={
      slug:req.body.slug,
      desc:req.body.desc,
      date:new Date
    };
    const cId=Comments.push(newComment).getKey();
    const parentId=req.body.parentId; 
  
    if(req.body.root===false)
    {
      const ref=Comments.child(parentId).child("children");
      ref.push(cId);
    }
  
    Comments.once('value',(comment)=>{
      res.status(400).send(comment.val());
    });
  
  })
  
  router.get('/getComment',(req,res)=>{
    Comments.once('value',(comment,prevChildKey)=>{
      return res.status(200).send(comment.val());
    });
  })
  
  router.get('/getCommentBySlug/:slug',(req,res)=>{
    Comments.orderByChild("slug").equalTo(req.params.slug).once('value',(comment,prevChildKey)=>{
      return res.status(200).send(comment.val());
    });
  })
  
  router.get('/getCommentById/:pId',async (req,res)=>{

    var children=[];
    var result=[];
    Comments.child(req.params.pId).child("children").once('value',async (comment)=>{
        children=comment.val();
        console.log(comment.val());
    });

    console.log(children);

    for(const child of children){
        console.log(child.key);
        result.push(child.key);
    }
    return res.send(result);
  })
  
  module.exports=router;