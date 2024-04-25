const mongoose = require("mongoose");
const slugify = require("slugify");
// const validator = require("validator");
const User = require("./userModel");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name "], // Validator
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must have less than or equal 40 characters"], // built in Validator
      minlength: [10, "A tour name must have more than or equal 10 characters"], // built in Validator
      // validate: [validator.isAlpha, "Tour name must only contain characters "],
    },

    slug: String,

    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"], // (Validator)  values that are allowed to use in this field
        message: "Difficulty is either : easy, medium, difficult", // error message
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"], // built in Validator
      max: [5, "Rating must be below 5.0"], // built in Validator
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      // custom validator
      validate: {
        validator: function (val) {
          return val < this.price; // this keyword refers to the current document when creating new document and don`t work with update
        },
        message: "Discount price({VALUE}) must be below the regular price", // ({VALUE}) -> used to access the value that input ed (val)
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],

    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: "point",
        enum: ["point"],
      },
      coordinates: [Number], // [longitude, latitude]
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "point",
          enum: ["point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// document middleware runs before .save() and .create() (used to remove any space or special character in the name to use it in the URL)
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Embedding guides in the tour model
// tourSchema.pre("save", async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.post("save", function (doc, next) {
//   console.log(doc);
//   next();
// });

//Query Middleware
// pre middleware runs before the query has executed

// /^find/ -> means all strings than begin with {find}
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

// post middleware runs after the query has executed
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} millisecond`);
  next();
});

//Aggregation Middleware
// next => means that the middleware is finished and the next middleware can start
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); // unshift -> add element at the beginning of an array
  console.log(this.pipeline());
  next();
});
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
