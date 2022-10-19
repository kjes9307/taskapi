const mongoose = require('mongoose');

const taskdetailSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'project id必填'],
    },
    member :[
      {
        ref:"user",
        type: mongoose.Schema.ObjectId,
        required: [true, 'memeber 必填'],
      }
    ]
  },{
    versionKey: false,
    collection: 'taskdetail',
});

const Taskdetail = mongoose.model('taskdetail', taskdetailSchema);

module.exports = Taskdetail;