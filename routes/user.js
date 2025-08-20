const express = require("express"); //Importing the express module to create a router
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router(); //Creating a new router instance
const User = require("../models/user"); //Importing the User model to interact with user data
const passport = require("passport"); //Importing passport for authentication

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs"); //Rendering the index view for users
}); //Route to handle GET requests to the root of the user routes

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body; //Destructuring the request body to get username, email, and password
      const newUser = new User({ email, username }); //Creating a new User instance with the provided
      const registeredUser = await User.register(newUser, password); //Registering the new user with the provided password
      console.log(registeredUser); //Logging the registered user to the console
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err); //Handling any errors that occur during login
        }
        req.flash("success", "Welcome to Wanderlust!"); //Setting a flash message to indicate successful registration
        res.redirect("/listings"); //Redirecting the user to the listings page after successful registration
      }); //Logging in the user after successful registration
    } catch (e) {
      req.flash("error", e.message); //Setting a flash message to indicate an error during registration
      res.redirect("/signup"); //Redirecting the user back to the signup page in case of an error
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs"); //Rendering the login view for users
}); //Route to handle GET requests to the login page

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true, //Enabling flash messages for failed login attempts
    failureRedirect: "/login", //Redirecting to the login page on failure
  }),
  async (req, res) => {
    req.flash("success", "Welcome back! You are now logged in.");
    res.redirect("/listings"); //Setting a flash message to indicate successful login
  }
); //Route to handle POST requests for user login with passport authentication

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err); //Handling any errors that occur during logout
    }
    req.flash("success", "Goodbye! ,You are logged out"); //Setting a flash message to indicate successful logout
    res.redirect("/listings"); //Redirecting the user to the listings page after logout
  });
}); //Route to handle user logout
module.exports = router; //Exporting the user router to be used in app.js
