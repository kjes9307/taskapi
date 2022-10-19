const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
      type: Number,
    },
    name: {
        type: String,
        cast: false
    }
    
  },{
    versionKey: false,
});
// User
const userProject = mongoose.model('project', userSchema);

module.exports = userProject;