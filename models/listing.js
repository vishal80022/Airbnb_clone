const mongoose = require("mongoose");
const Review = require("./review"); //Importing the Review model to create a reference in the Listing model

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
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review", //Reference to the Review model
    },
  ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } }); //Deleting all reviews associated with the listing being deleted
  }
});

const Listing = mongoose.model("Listing", listingSchema); //Creating a model named Listing using the listingSchema
module.exports = Listing;
