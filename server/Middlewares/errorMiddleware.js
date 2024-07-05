const errorMidleware = (err, req, res, next) => {
  err.message = err.message || "Something went wrong";
  console.log(err.statuscode);
  const statusCode = err.statuscode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: err.stack,
  });
};

export default errorMidleware;
