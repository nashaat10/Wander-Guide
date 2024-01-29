const express = require("express");
const app = express();
const morgan = require("morgan");

const AppError = require("./Natours/utils/appError");
const globalErrorHandler = require("./Natours/controller/errorController");
const tourRouter = require("./Natours/routes/tourRoutes");
const userRouter = require("./Natours/routes/userRoutes");

// 1) Middleware
app.use(express.json());
app.use(morgan("dev"));
// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"));
// }
app.use(express.static("./Natours/public"));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) Route Handler

// app.delete("/api/v1/tours/:id", deleteTour);
// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id", getTour);
// app.post("/api/v1/tours", createTour);
// app.patch("/api/v1/tours/:id", updateTour);

// 3) Routes

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// all is used to handel all the http methods in one time
app.all("*", (req, res, next) => {
  next(new AppError(`cant find ${req.originalUrl} on this server`, 404));
});

// global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
