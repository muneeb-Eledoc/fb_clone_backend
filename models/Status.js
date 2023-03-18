const mongoose = require("mongoose");

const StatusSchema = new mongoose.Schema({
  userId:{
      type:String,
      required: true
  },
  media:{
     type:String,
     required: true
  },
  type: {
    type:String,
    required: true
  },
  views:{
      type:Array,
      default:[]
  }
 },
{ timestamps:true}
);

module.exports = mongoose.model("Status", StatusSchema);