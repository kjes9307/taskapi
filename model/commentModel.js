const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    userComment: {
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
      require: ['true', 'user must belong to a post.']
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'post',
      require: ['true', 'comment must belong to a post.']
    }
  },{
    versionKey: false,
    }
);
// 有人用到find 且與collection有關
commentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });

  next();
});
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;