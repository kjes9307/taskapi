const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config({path :"./config.env"});
const db = process.env.DATABASE_URL.replace('<password>',process.env.DATABASE_Pass)
mongoose.connect(db) // 連到你要的db
    .then(()=>{
        console.log('資料庫連線成功')
    })
    .catch((error)=>{
        console.log(error);
    });