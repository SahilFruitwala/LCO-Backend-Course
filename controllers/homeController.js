const BigPromise = require("../middlewares/bigPromise");

exports.home = BigPromise((req, res) => {
  res.status(200).json({
    success: true,
    greeeting: "Hello World!",
  });
})

exports.homeDumy = (req, res) => {
  res.status(200).json({
    success: true,
    greeeting: "Hello Dummy!",
  });
};
