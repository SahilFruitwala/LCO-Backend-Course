const mongoose = require("mongoose");

const { MONGODB_URI } = process.env;

exports.connect = () => {
  mongoose
    .connect(MONGODB_URI)
    .then(console.log("DB CONNECTION SUCCESS!"))
    .catch((err) => {
      console.log("DB CONNECTION FAILED!");
      console.log(err);
      process.exit(1);
    });
};
