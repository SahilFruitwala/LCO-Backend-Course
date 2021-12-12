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
  adminGetAllUsers,
  managerGetAllUsers,
  adminGetOneUsers,
  adminUpdateUserDetails,
  adminDeleteUser,
} = require("../controllers/userController");
const { isLoggedIn, customRole } = require("../middlewares/user");

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/signout").get(signout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/dashboard").get(isLoggedIn, getUserDeatils);
router.route("/password/reset").post(isLoggedIn, changePassword);
router.route("/update").put(isLoggedIn, updateUserDetails);

// admin routes
router
  .route("/admin/users")
  .get(isLoggedIn, customRole("admin"), adminGetAllUsers);
router
  .route("/admin/user/:id")
  .get(isLoggedIn, customRole("admin"), adminGetOneUsers);
router
  .route("/admin/user/:id")
  .put(isLoggedIn, customRole("admin"), adminUpdateUserDetails);
router
  .route("/admin/user/:id")
  .delete(isLoggedIn, customRole("admin"), adminDeleteUser);

// manager routes
router
  .route("/manager/users")
  .get(isLoggedIn, customRole("manager"), managerGetAllUsers);

module.exports = router;
