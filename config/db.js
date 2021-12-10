const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then(console.log("DB is connected..."))
    .catch((error) => {
      console.log("DB connection issues..");
      console.log(error);
      process.exit(1);
    });
};

module.exports = connectDB;
