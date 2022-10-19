const jwt = require('jsonwebtoken');

const defineStatus = {
    200 : "success",
    404 : "error",
    401 : "Data not found",
    400 : "Input Error"
}
// express status code 預設200
const responseHandler = (res,data,statusCode) => {
    if(data !== null) {
        res.status(statusCode).json({
            status : statusCode,
            data : data,
            msg: defineStatus[statusCode]
        })
    }else{
        res.status(statusCode).json({
            status : statusCode,
            data : [],
            msg: defineStatus[statusCode]
        })
    }
}

const checkInput = (body,res,next) => {
    if(Object.keys(body).length === 0){  
        return next(appError("404","Clinet Input Error",next,res))
    }else{
        let element = ["name","content","tags","type"];
        for(let i = 0 ; i< element.length;i++){
            let key = element[i]
            if(body[key] === "" || !body[key] === true){
                console.log(`${key} is required`)
                return next(appError("404",`${key} is required, Check Input Error`,next,res))
            }
        }
    }
}

// async error handle
const asyncErrorHandler = (func) => {
    return async(req,res,next)=>{
        try{
            await func(req,res,next)
        }catch(err){
            console.log("@asyncErrorHandler",err)
            next(appError(404,msg = err.name,next,res))
        }
    }
}

const appError = (httpStatus,errorInfo,next,res)=>{
    const error = new Error();
    error.name = errorInfo.name || errorInfo;
    error.message = errorInfo.message;
    error.statusCode = httpStatus;
    error.isDefineError = true;
    next(error,res);
}

const errorResponse = (error,res) => {
    let {isDefineError,statusCode,name} = error;
    statusCode = statusCode || 500;
    if(isDefineError){
        res.status(statusCode).json({
            status : statusCode,
            message : name
        })
    }else{
        res.json({
            "message":"undefined error, please contact admin"
        })
    }
}

const errorResponseDEV = (error,res) => {
    let {isDefineError,statusCode,name,message,stack} = error;
    statusCode = statusCode || 500;
    res.status(statusCode).json({
        stack,
        message,
        name,
        isDefineError
    })
}
const tokenGenerator= (user,statusCode)=>{
    // 產生 JWT token
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
      expiresIn: process.env.JWT_EXPIRES_DAY
    });
    user.password = undefined; // pw 不要丟到前台
    let resData = {
        token,
        name: user.name,
        sex: user.sex,
        photo: user.photo,
        id: user._id
    }
    return [resData,statusCode]
  }
const tokenChecker = async(token) =>{
    return await new Promise((resolve,reject)=>{
        jwt.verify(token,process.env.JWT_SECRET,(err,payload)=>{
          if(err){
            console.log(err)
            reject(err)
          }else{
            resolve(payload)
          }
        })
    })
}
const isVoid = (value) =>
  value === undefined || value === null || value === "";

const cleanObject = (object) => {
    const result = { ...object };
    Object.keys(result).forEach((key) => {
      const value = result[key];
      if (isVoid(value)) {
        delete result[key];
      }
    });
    return result;
  };
module.exports = {
    asyncErrorHandler,
    responseHandler,
    errorResponse,
    errorResponseDEV,
    checkInput,
    appError,
    tokenGenerator,
    tokenChecker,
    cleanObject
};