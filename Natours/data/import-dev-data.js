const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Tour = require("../models/tourModel");
const User = require("../models/userModel");
const Review = require("../models/reviewModel");
// console.log(app.get("env"));

dotenv.config({ path: "./Natours/config.env" });

// const DB = process.env.DATABASE;

const db_username = process.env.DATABASE_USERNAME;
const db_password = process.env.DATABASE_PASSWORD;
const DB = `mongodb://${db_username}:${db_password}@mongo:27017`;

// console.log(DB);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection is done"));

const tours = JSON.parse(fs.readFileSync("./Natours/data/tours.json", "utf-8"));
const users = JSON.parse(fs.readFileSync("./Natours/data/users.json", "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync("./Natours/data/reviews.json", "utf-8")
);

const importData = async () => {
  try {
    await Tour.create(tours, { validateBeforeSave: false });
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log("Data loaded successfuly");
    process.exit(1);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data deleted successfuly");
    process.exit(1);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

//node .\Natours\data\import-dev-data.js --import
