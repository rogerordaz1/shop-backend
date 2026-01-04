const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;

    console.error(error);
    // Mongoose Bad ObjectId
    if (err.name === "CastError") {
      const message = `Resource not found. Invalid: ${err.path}`;
      error = new Error(message);
      error.statusCode = 400;
    }

    // Mongoose Duplicate Key
    if (err.code === 11000) {
      const message = `Duplicate field value entered: ${JSON.stringify(
        err.keyValue
      )}`;
      error = new Error(message);
      error.statusCode = 400;
    }

    // Mongoose Validation Error
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      const message = `Invalid input data. ${messages.join(". ")}`;
      error = new Error(message);
      error.statusCode = 400;
    }

    return res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message || "Server Error" });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
