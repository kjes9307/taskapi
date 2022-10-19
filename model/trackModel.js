const mongoose = require('mongoose');
const trackSchema = new mongoose.Schema({
    followList: [
        { 
            _id:{
                type: mongoose.Schema.ObjectId, 
                ref: 'user'
            },
            followDate: {
                type: Date,
                default: Date.now          
            }
        }
    ], // 追蹤名單
    user:{
        ref:"user",
        type: mongoose.Schema.ObjectId,
        required : [true,'user not exist']
    } // 擁有者
},{
    versionKey: false
})

const Track = mongoose.model('track', trackSchema);

module.exports = Track;