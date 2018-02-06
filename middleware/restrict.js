var restrict=(req,res,next)=>{
    var dob=new Date(req.body.dateOfBirth);
    var today=new Date();
    var age=today.getFullYear()-dob.getFullYear();
    var m=today.getMonth()-dob.getMonth();
    if(m<0||(m==0 && today.getDate()<dob.getDate())){
        age--;
    }
    if(age>=18){
        console.log("Age is ok");
        next();
    }else{
        console.log("Access Denied");
        res.status(401).send("Access Denied. Age should be greater than 18");
    }
};

module.exports={restrict};
