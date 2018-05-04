const express=require('express');
const bodyParser=require('body-parser');
const {ObjectID}=require('mongodb');

var {mongoose}=require('./db/mongoose');
var {Blog}=require('./models/blogs');
var {logger}=require('./middleware/logger');
var {restrict}=require('./middleware/restrict');

var app=express();

const port=process.env.PORT||3000;
app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));
app.use(logger);

app.get('/blogs',(req,res)=>{
    Blog.find().then((blogs)=>{
        res.send(blogs);
    },(err)=>{
        res.status(400).send(err);
    });
});

app.get('/blogs/:id',(req,res)=>{
    var id=req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Blog.findOne({_id:id}).then((blog)=>{
        if(!blog){
            return res.status(404).send();
        }
        res.send(JSON.stringify(blog,undefined,2));
    },(err)=>{
        res.status(400).send(err);
    });
});

app.post('/blog/create',restrict,(req,res)=>{
    var blog=new Blog({
        title:req.body.title,
        subTitle:req.body.subTitle,
        blogBody:req.body.blogBody,
        created:Date.now(),
        lastModified:Date.now()
    });
    var _body=req.body;
    var allTags=(_body.allTags!=undefined && _body.allTags!=null)?_body.allTags.split(','):'';
    blog.tags=allTags;

    authorInfo={Name:req.body.authorName,email:req.body.email,dob:req.body.dateOfBirth};
    blog.author=authorInfo;

    blog.save().then((doc)=>{
        res.send(doc);
    },(e)=>{
        res.status(400).send(e);
    });
});

app.patch('/blogs/:id/update',(req,res)=>{
    var id=req.params.id;
    var body=req.body;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    body.lastModified=Date.now();
    Blog.findOneAndUpdate({_id:id},{$set:body},{new:true}).then((blog)=>{
        if(!blog){
            return res.status(404).send();
        }
        res.send({blog});
    }).catch((err)=>{
        res.status(400).send();
    });
});

app.delete('/blogs/:id/delete',(req,res)=>{
    var id=req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Blog.findOneAndRemove({_id:id}).then((blog)=>{
        if(!blog){
            return res.status(404).send();
        }
        res.send(JSON.stringify(blog,undefined,2));
    },(err)=>{
        res.status(400).send(err);
    });
});

app.get('*',(req,res,next)=>{
    res.status=404;
    next('Path not found');
});

app.use((err,req,res,next)=>{
    if(res.status==404){
        res.send("No such page exists");
    }else{
        console.log("Internal Server Error "+err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port,()=>{
    console.log(`Started up at port ${port}`);
});