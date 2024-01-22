const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Tour = require("../models/tourModel");
// console.log(app.get("env"));

dotenv.config({ path: "./Natours/config.env" });

const DB = process.env.DATABASE;

// console.log(DB);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection is done"));

const tours = JSON.parse(
  fs.readFileSync("./Natours/data/tours-simple.json", "utf-8")
);

const importData = async () => {
  try {
    await Tour.create(tours);
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
