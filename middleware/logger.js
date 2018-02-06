var logger =(req, res, next)=> {
    req.requestTime = new Date();
    console.log("Current Time for Request "+req.requestTime +" "+req.method +" "+req.originalUrl );
    next()
  };

  module.exports={logger};