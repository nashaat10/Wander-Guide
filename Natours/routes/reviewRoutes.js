const express = require("express");
const reviewController = require("../controller/reviewController");
const authController = require("../controller/authController");

const router = express.Router();

router.use(authController.protect);

router
  .get("/", reviewController.getAllReviews)
  .post("/", authController.restrictTo("user"), reviewController.createReview);

module.exports = router;
