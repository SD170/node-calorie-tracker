const router = require("express").Router();
const {
  createMeal,
  getAllMeals,
  calorieOverflowByUser,
  deleteMeal,
  updateMeal,
  lastWeekMeals,
  lastWeekAvgCalorie,
  getUserMeals
} = require("../controllers/meal.controller");
const { checkRole } = require("../middlewares/permissions");
const { ROLES } = require("../utils/roleList");

router.route("/createMeal").post(createMeal);
router.route("/calorieOverflowByUser").get(calorieOverflowByUser);


router.route("/getUserMeals").get(getUserMeals);
router
  .route("/", checkRole(ROLES.ADMIN))
  .get(getAllMeals)
  .put(updateMeal)
  .delete(deleteMeal); // checkRole() is redd but clear code
router.route("/lastWeekMeals", checkRole(ROLES.ADMIN)).get(lastWeekMeals);
router.route("/lastWeekAvgCalorie", checkRole(ROLES.ADMIN)).get(lastWeekAvgCalorie);


module.exports = router;
