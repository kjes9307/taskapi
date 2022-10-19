const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    projectId: {
        type: String,
        cast: false,
        required: [true, 'project id必填'],
    },
    type:{
        type: Number,
        cast: true
    },
    taskName:{
        type: String,
        required: [true, 'task Name必填'],
        cast: false
    },
    status:{
        type:String,
        required: [true, '狀態必填'],
        enum: ['ongoing', 'idle', 'done'],
        cast: false
    },
    taskCreator:{
        ref:"user",
        type: mongoose.Schema.ObjectId,
      required : [true,'創建人必填']
    },
    taskTodoList :[
      {
        ref:"todo",
        type: mongoose.Schema.ObjectId
      }
   ],
    createAt :{
      type: Date,
      default: Date.now,
      select: false
    }
  },{
    versionKey: false,
    collection: 'task',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
taskSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'taskCreator',
      select: 'name'
    });
  
    next();
});

taskSchema.virtual('comments', {
  ref: 'TaskComment',
  foreignField: 'task',
  localField: '_id'
});
const Task = mongoose.model('task', taskSchema);

module.exports = Task;