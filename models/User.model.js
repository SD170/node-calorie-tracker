const mongoose = require("mongoose");
const { ROLES } = require("../utils/roleList");


const UserSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: Object.values(ROLES),
    required:true
  },
  username: {
    type: String,
  },
  calorieLimit:{
    type:Number   // can be made required in "pre" save()
  }
});


const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
