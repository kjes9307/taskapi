const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.ObjectId,
        ref: 'testUser',
        required: [true, 'project id必填'],
    },
    receiver :{
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: [true, '收件人必填'],
    },
    sender :{
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: [true, '邀請人必填'],
    },
    status :{
        type: String,
        required: [true,'狀態必填'],
        enum: ['await', 'reject', 'check'],
        cast: false
    }
    
  },{
    versionKey: false,
    collection: 'invitation',
    timestamps: true
});

const Invite = mongoose.model('invitation', inviteSchema);

module.exports = Invite;