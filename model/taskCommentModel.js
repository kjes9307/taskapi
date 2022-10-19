const mongoose = require('mongoose');

const taskCommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, 'comment can not be empty!']
    },
    createTime: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
      require: ['true', 'user must exist']
    },
    task: {
      type: mongoose.Schema.ObjectId,
      ref: 'task',
      require: ['true', 'comment must belong to a task.']
    }
  },{
    versionKey: false,
    collection: "taskcomment",
    timestamps: true

    }
);
taskCommentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });

  next();
});
const TaskComment = mongoose.model('TaskComment', taskCommentSchema);

module.exports = TaskComment;