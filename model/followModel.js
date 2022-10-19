const mongoose = require('mongoose');

const followSchema = new mongoose.Schema(
  {
    createTime: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
      require: ['true', 'user must belong to a post.']
    },
    follower: [
      {
          type: mongoose.Schema.ObjectId,
          ref: 'user'
      }
    ]
  },{
    versionKey: false,
    }
);
followSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'follower',
    select: 'name'
  });

  next();
});
const Follow = mongoose.model('follow', followSchema);

module.exports = Follow;