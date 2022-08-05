const router = require("express").Router();
const { createUser } = require("../controllers/user.controller");
const { authenticate, setRole } = require("../middlewares/permissions");
const { ROLES } = require("../utils/roleList");
const mealRouter = require("./meal.route");

// //re-route into other mealRouter
// no need to check role, as user is LEVEL1 role
router.use("/meal", authenticate, mealRouter);

// user routes
router.route("/createUser").post(setRole(ROLES.LEVEL1), createUser);

module.exports = router;
