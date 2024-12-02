const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./Natours/config.env" });
const app = require("./app");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught Exception! Shutting down...");
  process.exit(1);
});

// console.log(app.get("env"));
// const DB = process.env.DATABASE;
const db_username = process.env.DATABASE_USERNAME;
const db_password = process.env.DATABASE_PASSWORD;
// const DB = `mongodb://${db_username}:${db_password}@mongo:27017/natours`;
const DB = `mongodb://mongo:27017/natours`;

// console.log(DB);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection is done"));

const port = 2000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection! Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
