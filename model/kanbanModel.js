const mongoose = require('mongoose');

const kanbanSchema = new mongoose.Schema({
    projectId: {
        type: String,
        cast: false,
        required: [true,'project id 不正確!']
    },
    alltask: [
      {
        ref:"task",
        type: mongoose.Schema.ObjectId
      }
    ],
    kanbanName:{
      type: String,
      cast:false,
      required: [true,'kanban name必填!']
    },
    creator:{
      ref:"user",
      type: mongoose.Schema.ObjectId,
      required : [true,'創建人必填']
    },
    createAt :{
      type: Date,
      default: Date.now,
      select: false
    }
  },{
    versionKey: false,
    collection: 'kanban',
    // timestamps:true
});
const Kanban = mongoose.model('kanban', kanbanSchema);

module.exports = Kanban;