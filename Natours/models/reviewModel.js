const mongoose = require("mongoose");
const Tour = require("./tourModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can not be empty"],
    },
    rating: {
      type: Number,
      nim: 1,
      max: 5,
      required: [true, "Review must have a rating."],
    },
    createAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user."],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: "tour",
  //   select: "name",
  // }).populate({
  //   path: "user",
  //   select: "name photo",
  // });

  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

// Static method to calculate average rating and quantity of ratings for a tour when a review is created
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  // Update the tour document with the new stats

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// Call calcAverageRatings after a review is saved
// post middleware has no access to next() function
// this.constructor points to the model that created the document (the current document)
reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.tour);
});

// to update  ratings when a review is updated or deleted
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne(); // retrieve the current document from the database and store it in the query variable r to get access to it in the post middleware
  next();
  // we did not use callAverageRatings here because we need to wait for the query to execute  and  update the ratings
});

reviewSchema.post(/^findOneAnd/, async function () {
  // this.r = await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
