const express = require("express"); //Requring express pakage
const app = express(); //Creating an instance(Object) of express
const mongoose = require("mongoose"); //Requring mongoose package
const Listing = require("./models/listing"); //Importing the Listing model from models/listing.js
const path = require("path"); //Requiring path module to handle file paths
const methodOverride = require("method-override"); //Requiring method-override package to use PUT and DELETE methods in forms
app.use(methodOverride("_method")); //Middleware to override the HTTP method for forms, allowing us to use PUT and DELETE methods
const ejsMate = require("ejs-mate"); //Requiring ejsMate package to use EJS as the template engine with additional features
const ExpressError = require("./utils/ExpressError"); //Importing the ExpressError class from utils/ExpressError.js
const wrapAsync = require("./utils/wrapAsync"); //Importing the wrapAsync function from utils/wrapAsync.js to handle async errors

//Setting up mongoose to connect to MongoDB
//Also,we have used async-await that's why this main function return a promise
main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust"); //Here we are using await because it may take time to connect to the database
}

app.set("view engine", "ejs"); //Setting the view engine to ejs
app.set("views", path.join(__dirname, "views")); //Setting the views directory to the views folder in the current directory
app.use(express.urlencoded({ extended: true })); //Middleware to parse URL-encoded bodies
app.use(express.static(path.join(__dirname, "public"))); //Middleware to serve static files from
app.engine("ejs", ejsMate); //Using ejsMate as the template engine for ejs files

app.get("/", (req, res) => {
  res.send("Hi,I am root");
}); //Seding a response to the client on root route

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "Beautiful Beach House",
//     description: "A lovely beach house with stunning ocean views.",
//     price: 150,
//     location: "Malibu, CA",
//     country: "USA",
//   });
//   await sampleListing.save(); //Saving the sample listing to the database
//   res.send("Sample listing created successfully!"); //Sending a response to the client
// }); //This route is for testing the Listing model

//Index Route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({}); //Fetching all listings from the database
  res.render("./listings/index.ejs", { allListings }); //Rendering the index.ejs file and passing allListings to it
}); //This route is for fetching all listings and rendering them on the index page

//New Route
app.get("/listings/new", (req, res) => {
  res.render("./listings/new.ejs"); //Rendering the new.ejs file to create a new listing
}); //This route is for rendering the form to create a new listing

//create Route
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  console.log(req.body.listing); //Creating a new listing with the data from the request body
  await newListing.save(); //Saving the new listing to the database
  res.redirect("/listings"); //Redirecting to the index page after saving the listing
}); //This route is for creating a new listing and saving it to the database

//Show Route
app.get("/listings/:id", async (req, res) => {
  const { id } = req.params; //Extracting the id from the request parameters
  const listing = await Listing.findById(id); //Finding the listing by id in the database
  res.render("./listings/show.ejs", { listing }); //Rendering the show.ejs file and passing the listing to it
}); //This route is for fetching a single listing by id and rendering it on the show page

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params; //Extracting the id from the request parameters
  const listing = await Listing.findById(id); //Finding the listing by id in the database
  res.render("./listings/edit.ejs", { listing }); //Rendering the edit.ejs file and passing the listing to it
}); //This route is for rendering the form to edit a listing

//Update Route
app.put("/listings/:id", async (req, res) => {
  const { id } = req.params; //Extracting the id from the request parameters
  await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //Updating the listing by id in the database and returning the updated listing
  res.redirect(`/listings/${id}`); //Redirecting to the index page after updating the listing
}); //This route is for updating a listing by id in the database

//delete Route
app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params; //Extracting the id from the request parameters
  await Listing.findByIdAndDelete(id); //Deleting the listing by id in the database
  res.redirect("/listings"); //Redirecting to the index page after deleting the listing
}); //This route is for deleting a listing by id in the database

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found")); //Handling all other routes that are not defined
}); //This route is for handling all other routes that are not defined

app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong!" } = err; //Extracting the status and message from the error object
  res.status(status).send(message); //Rendering the error.ejs file and passing the error object to it
}); //This route is for handling errors and rendering the error page

app.listen(8080, () => {
  console.log("server is running on port 8080");
});
