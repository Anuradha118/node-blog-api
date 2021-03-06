var mongoose=require('mongoose');

var Schema=mongoose.Schema;

var blogSchema= new Schema({
    title:{
        type:String,
        default:'',
        required:true
    },
    subTitle:{
        type:String,
        default:''
    },
    blogBody:{
        type:String,
        default:''
    },
    tags:[],
    created:{
        type:Date
    },
    lastModified:{type:Date},
    author:{}
});

var Blog=mongoose.model('Blog',blogSchema);

module.exports={Blog};