function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next); //Catches any errors thrown by the async function and passes them to the next middleware
  };
} //This function wraps an async function and catches any errors that occur during its execution

module.exports = wrapAsync; //Exporting the wrapAsync function to be used in other files
