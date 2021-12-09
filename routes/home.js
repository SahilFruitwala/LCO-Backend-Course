const router = require("express").Router();

const { home, homeDumy } = require("../controllers/homeController");

router.route("/").get(home);
router.route("/dummy").get(homeDumy);

module.exports = router;
