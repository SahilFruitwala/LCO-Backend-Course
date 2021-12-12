const router = require("express").Router();

const {
  signup,
  signin,
  signout,
  forgotPassword,
  resetPassword,
  getUserDeatils,
  changePassword,
  updateUserDetails,
} = require("../controllers/userController");
const { isLoggedIn } = require("../middlewares/user");

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/signout").get(signout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/dashboard").get(isLoggedIn, getUserDeatils);
router.route("/password/reset").post(isLoggedIn, changePassword);
router.route("/update").post(isLoggedIn, updateUserDetails);

module.exports = router;
