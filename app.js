const path = require("path");
const express = require("express");
const app = express();
const morgan = require("morgan");
const rateLimit = require("express-rate-limit"); // limit the number of request from a single ip
const helmet = require("helmet"); // set security http headers
const mongoSanitize = require("express-mongo-sanitize"); // data sanitization against NoSQL query injection
const xss = require("xss-clean"); // data sanitization against xss
const hpp = require("hpp"); // prevent parameter pollution

const AppError = require("./Natours/utils/appError");
const globalErrorHandler = require("./Natours/controller/errorController");
const tourRouter = require("./Natours/routes/tourRoutes");
const userRouter = require("./Natours/routes/userRoutes");
const reviewRouter = require("./Natours/routes/reviewRoutes");

// 1) Global Middlewares
// set security http headers
app.use(helmet());

// body parser, reading data from body into req.body
app.use(express.json());

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// data sanitization against xss
app.use(xss());

// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

// development logging
app.use(morgan("dev"));

// serving static files
app.use(express.static("./Natours/public"));

// limit the number of request from a single ip
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in an hour!",
});

// limit the number of request from a single ip
app.use("/api", limiter);

//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
});

// 3) Routes

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

// all is used to handel all the http methods in one time
app.all("*", (req, res, next) => {
  next(new AppError(`cant find ${req.originalUrl} on this server`, 404));
});

// global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
