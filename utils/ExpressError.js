class ExpressError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
module.exports = ExpressError; //Exporting the ExpressError class to be used in other files
