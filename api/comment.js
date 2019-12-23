const express=require('express');
const router=express.Router();
const firebase=require('../modules/firebase');

const database = firebase.database();
const Comments=database.ref().child("Comments");

router.post('/addComment',(req,res)=>{

    const date=new Date;
    const newComment={
      slug:req.body.slug,
      desc:req.body.desc,
      date:date
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
  
  router.get('/getCommentById/:pId', async (req,res)=>{

  const childComment=new Promise((resolve,reject)=>{
    const result=Comments.child((req.params.pId)+"/children").once('value');
    if(result)
    return resolve(result);
    else
    return reject(new Error("Couldn't find child comments")); 
  });

    const results=[];
    const result=async()=>{
        let comments=await childComment;
        comments=comments.val();
      
        for(const ele in comments)
        {
              const result=await Comments.child(comments[ele]).once('value');
              results.push(result.val());
        }
        return results;
  }

  result()
    .then((result)=>{
      return res.send(result);
    })
    .catch((err)=>{
      console.log(err.message);
    })

  })
  
  module.exports=router;