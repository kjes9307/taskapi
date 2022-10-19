const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'project id必填'],
    },
    images :[
      {
        type: String,
        required: [true, 'image必填'],
      }
    ]
  },{
    versionKey: false,
    collection: 'imagestore',
});

const ImageStore = mongoose.model('imagestore', imageSchema);

module.exports = ImageStore;