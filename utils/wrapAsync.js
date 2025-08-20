module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); //Executing the async function and catching any errors that occur
  };
};
