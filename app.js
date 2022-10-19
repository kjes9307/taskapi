const cors = require('cors')
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require("dotenv");
const swaggerUI = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json")
const {errorResponse,appError,errorResponseDEV} = require('./util/tool')
require('./connect')
dotenv.config({path :"./config.env"});
const postRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const taskRouter = require("./routes/task")
const app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
require('./util/exceptionHandle')

// app.use('/', indexRouter);
app.use('/posts', postRouter);
app.use('/user', userRouter);
app.use('/task',taskRouter);
app.use('/api-doc',swaggerUI.serve,swaggerUI.setup(swaggerFile));

app.use((req,res,next)=>{
    /**
     * #swagger.ignore = true
     */
    console.log("@404路由");
    appError(404,"URL Not Found",next,res)
})

app.use((err,req,res,next)=>{
    /**
     * #swagger.ignore = true
     */
    const {name,statusCode}=err;
    console.log("Error Manager",name,statusCode)
    if(process.env.NODE_ENV==='dev'){
        return errorResponseDEV(err,res)
    }
    errorResponse(err,res);
})
module.exports = app;
