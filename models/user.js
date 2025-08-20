const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  //username and password are automatically added by passport-local-mongoose
  email: {
    type: String,
    required: true,
  },
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema); //Creating a model named User using the userSchema
//This model will be used to interact with the users collection in the database
