const express = require("express"); //Importing the express module to create a router
const router = express.Router(); //Creating a new router instance
const wrapAsync = require("../utils/wrapAsync"); //Importing the wrapAsync utility function to handle async errors
const ExpressError = require("../utils/ExpressError"); //Importing the ExpressError class to handle errors
const { listingSchema, reviewSchema } = require("../schema.js"); //Importing the listing schema for validation
const Listing = require("../models/listing"); //Importing the Listing model from models/listing.js
const { isLoggedIn } = require("../middleware"); //Importing the isLoggedIn middleware to check if the user is authenticated

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body); //Validating the request body against the listing schema
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(", "); //Extracting the error message from the validation error
    throw new ExpressError(400, errMsg);
  } else {
    next(); //If validation passes, call the next middleware function
  } //Throwing an error if the validation
};

//Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({}); //Fetching all listings from the database
    res.render("./listings/index.ejs", { allListings }); //Rendering the index.ejs file and passing allListings to it
  })
); //This route is for fetching all listings and rendering them on the index page

//New Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("./listings/new.ejs"); //Rendering the new.ejs file to create a new listing
}); //This route is for rendering the form to create a new listing

//create Route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    console.log(req.body.listing); //Creating a new listing with the data from the request body
    await newListing.save(); //Saving the new listing to the database
    req.flash("success", "New listing created successfully!"); //Setting a flash message for success
    res.redirect("/listings"); //Redirecting to the index page after saving the listing
  })
); //This route is for creating a new listing and saving it to the database

//Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params; //Extracting the id from the request parameters
    const listing = await Listing.findById(id).populate("reviews"); //Finding the listing by id in the database
    if (!listing) {
      req.flash("error", "listing you are looking for does not exist!");
      return res.redirect("/listings"); //Redirecting to the index page if the listing is not found
    }
    res.render("./listings/show.ejs", { listing }); //Rendering the show.ejs file and passing the listing to it
  })
); //This route is for fetching a single listing by id and rendering it on the show page

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params; //Extracting the id from the request parameters
    const listing = await Listing.findById(id); //Finding the listing by id in the database
    if (!listing) {
      req.flash("error", "listing you are looking for does not exist!");
      return res.redirect("/listings"); //Redirecting to the index page if the listing is not found
    }
    res.render("./listings/edit.ejs", { listing }); //Rendering the edit.ejs file and passing the listing to it
  })
); //This route is for rendering the form to edit a listing

//Update Route
router.put(
  "/:id",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send Valid Data for listing"); //Throwing an error if the listing data is not valid
    }
    const { id } = req.params; //Extracting the id from the request parameters
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //Updating the listing by id in the database and returning the updated listing
    req.flash("success", "listing updated successfully!");
    res.redirect(`/listings/${id}`); //Redirecting to the index page after updating the listing
  })
); //This route is for updating a listing by id in the database

//delete Route
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params; //Extracting the id from the request parameters
    await Listing.findByIdAndDelete(id); //Deleting the listing by id in the database
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings"); //Redirecting to the index page after deleting the listing
  })
); //This route is for deleting a listing by id in the database

module.exports = router; //Exporting the router to use it in other files
