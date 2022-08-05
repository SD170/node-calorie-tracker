const router = require("express").Router();
const { createUser } = require("../controllers/user.controller");
const {authenticate, setRole, checkRole} = require('../middlewares/permissions');
const {ROLES} = require('../utils/roleList');
const mealRouter = require('./meal.route');


// //re-route into other mealRouter
router.use("/meal",authenticate, checkRole(ROLES.ADMIN),mealRouter);

// admin routes
router.route("/createAdmin").post(setRole(ROLES.ADMIN),createUser);



module.exports = router;
