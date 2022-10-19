
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, '請輸入您的名字'],
      cast: false
    },
    email: {
      type: String,
      required: [true, '請輸入您的 Email'],
      unique: true,
      lowercase: true,
      select: false
    },
    photo: {
        type :String,
        default:""  
    },
    sex:{
      type: String,
      default:""
    },
    password:{
      type: String,
      required: [true,'請輸入密碼'],
      minlength: 6,
      select: false,
      cast: false
    },
    token:{
      type: String,
      select: false,
      cast: false
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    }
  },{
    versionKey: false,
});
// User
const User = mongoose.model('user', userSchema);

module.exports = User;