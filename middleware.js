module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in to do that");
    return res.redirect("/login");
  }
  next();
};
// Middleware to check if the user is authenticated
// If not authenticated, it sets an error flash message and redirects to the login page
