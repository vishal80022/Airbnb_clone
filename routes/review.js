const express = require("express"); //Importing the express module to create a router
const router = express.Router({ mergeParams: true }); //Creating a new router instance
const wrapAsync = require("../utils/wrapAsync"); //Importing the wrapAsync utility function to handle async errors
const ExpressError = require("../utils/ExpressError"); //Importing the ExpressError class to handle errors
const { reviewSchema } = require("../schema.js"); //Importing the review schema for validation
const Review = require("../models/review"); //Importing the Review model from models/review.js
const Listing = require("../models/listing");

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body); //Validating the request body against the listing schema
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(", "); //Extracting the error message from the validation error
    throw new ExpressError(400, errMsg);
  } else {
    next(); //If validation passes, call the next middleware function
  } //Throwing an error if the validation
};

// Post Route
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id); //Finding the listing by id in the database
    let newReview = new Review(req.body.review); //Creating a new review with the data from the request body
    listing.reviews.push(newReview); //Pushing the new review to the reviews array of the listing
    await newReview.save(); //Saving the new review to the database
    await listing.save(); //Saving the updated listing to the database
    console.log("New review saved successfully!"); //Logging a success message to the console
    req.flash("success", "New review created successfully!");
    res.redirect(`/listings/${listing._id}`); //Redirecting to the show page of the listing after saving the review
  })
);

//Delete Review Route

router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params; //Extracting the id and reviewId from the request parameters
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //Removing the review from the listing's reviews array Also,pull means it will match the reviewId in review array and remove it
    await Review.findByIdAndDelete(reviewId); //Deleting the review by id in the database
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`); //Redirecting to the show page of the listing after deleting the review
  })
);

module.exports = router; //Exporting the router to use it in other files
