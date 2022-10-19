const jwt = require('jsonwebtoken');
const {asyncErrorHandler,appError} = require('./tool.js')
const User = require('../model/userModel');
const isAuth = asyncErrorHandler(async (req, res, next) => {
    // 確認 token 是否存在
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return next(appError(401,'你尚未登入！',next,res));
    }
  
    // 驗證 token 正確性
    const decoded = await new Promise((resolve,reject)=>{
      jwt.verify(token,process.env.JWT_SECRET,(err,payload)=>{
        if(err){
          reject(err)
        }else{
          resolve(payload)
        }
      })
    })
    const currentUser = await User.findById(decoded.id);
  
    req.user = currentUser;
    next();
  });

  module.exports = isAuth
