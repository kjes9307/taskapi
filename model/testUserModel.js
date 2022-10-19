const mongoose = require('mongoose');

const projSchema = new mongoose.Schema({
    id: {
      type: Number,
      cast: true
    },
    name: {
        type: String,
        cast: false
    },
    personId: {
        type: mongoose.Schema.ObjectId,
        cast: true
    },
    organization:{
        type:String,
        cast:false
    },
    pin:{
      type:Boolean
    },
    member:[{
      type: mongoose.Schema.ObjectId,
      select:false
    }]
  },{
    versionKey: false,
});
// User
const Proj = mongoose.model('testUser', projSchema);

module.exports = Proj;