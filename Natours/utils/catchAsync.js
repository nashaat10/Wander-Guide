module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); // the error catched by global error handler
  };
};
