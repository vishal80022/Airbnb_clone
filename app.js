const express = require("express"); //Requring express pakage
const app = express(); //Creating an instance(Object) of express
const mongoose = require("mongoose"); //Requring mongoose package
const path = require("path"); //Requiring path module to handle file paths
const methodOverride = require("method-override"); //Requiring method-override package to use PUT and DELETE methods in forms
app.use(methodOverride("_method")); //Middleware to override the HTTP method for forms, allowing us to use PUT and DELETE methods
const ejsMate = require("ejs-mate"); //Requiring ejsMate package to use EJS as the template engine with additional features
const ExpressError = require("./utils/ExpressError"); //Importing the ExpressError class to handle errors
const { wrap } = require("module");
const session = require("express-session"); //Requiring express-session package to handle sessions
const flash = require("connect-flash"); //Requiring connect-flash package to use flash messages in the application

const passport = require("passport");
const LocalStrategy = require("passport-local"); //Requiring passport-local strategy for local authentication
const User = require("./models/user.js"); //Importing the User model from models/user.js

const listingRouter = require("./routes/listing"); //Importing the listings routes from routes/listing.js
const reviewRouter = require("./routes/review"); //Importing the reviews routes from routes/review.js
const userRouter = require("./routes/user"); //Importing the user routes from routes/user.js
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

const sessionOptions = {
  secret: "mysessionsecret", //Secret key for signing the session ID cookie
  resave: false, //Forces session to be saved back to the session store even if it was never modified during the request
  saveUninitialized: true, //Forces a session that is new but not modified to be saved to the session store
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //Setting the cookie to expire in 7 day
    maxAge: 7 * 24 * 60 * 60 * 1000, //Setting the maximum age of the cookie to 7 days
    httpOnly: true, //Setting the cookie to be accessible only by the web server
  },
};

app.get("/", (req, res) => {
  res.send("Hi,I am root");
}); //Seding a response to the client on root route

app.use(session(sessionOptions)); //Using the session middleware with the defined options
app.use(flash()); //Using the flash middleware to enable flash messages

app.use(passport.initialize()); //Initializing passport for authentication
app.use(passport.session()); //Using passport session middleware to manage user sessions

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //Serializing the user for the session
passport.deserializeUser(User.deserializeUser()); //Deserializing the user from the session

app.use((req, res, next) => {
  res.locals.success = req.flash("success"); //Setting the success flash message to be accessible in all views
  res.locals.error = req.flash("error"); //Setting the error flash message to be accessible in all views
  res.locals.currUser = req.user; //Setting the current user to be accessible in all views
  next(); //Calling the next middleware function
}); //Middleware to set flash messages to be accessible in all views

app.use("/listings", listingRouter); //Using the listings routes for all routes starting with /listings
app.use("/listings/:id/reviews", reviewRouter); //Using the reviews routes for all routes starting with /listings/:id/reviews
app.use("/", userRouter); //Using the user routes for all routes starting with /users

app.all("/*splat", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found")); //Handling all other routes that are not defined
}); //This route is for handling all other routes that are not defined

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err; //Extracting the statusCode and message from the error object
  // res.status(statusCode).send(message); //Sending the error message with the status code
  res.render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("server is running on port 8080");
});
