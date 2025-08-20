const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  comment: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now, //Setting the default value of createdAt to the current date and time
  },
});

module.exports = mongoose.model("Review", reviewSchema); //Creating a model named Review using the reviewSchema
