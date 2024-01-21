const express = require("express");
const tourController = require("../controller/tourController");

const router = express.Router();

// byrg3 el id bta3 el tour ely 3mlt 3leha request

// router.param("id", tourController.checkID);
router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTour, tourController.getAllTours);

router.route("/tour-stats").get(tourController.getTourStats);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
