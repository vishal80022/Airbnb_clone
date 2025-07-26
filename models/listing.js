const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,

    //if image is null or not defined then default image will be used and when user pass empty string in image then link in ternary operator will be used
    default: "https://www.pexels.com/photo/autumn-camping-28216688/",
    set: (v) =>
      v === ""
        ? "https://www.pexels.com/photo/beige-painted-concrete-building-87378/"
        : v,
  },
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema); //Creating a model named Listing using the listingSchema
module.exports = Listing;
