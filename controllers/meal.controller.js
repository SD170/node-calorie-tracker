const asyncHandler = require("../middlewares/async");
const {
  Types: { ObjectId }
} = require("mongoose");
const MealModel = require("../models/Meal.model");
const UserModel = require("../models/User.model");
const ErrorResponse = require("../utils/errorResponse");
const { ROLES } = require("../utils/roleList");
const {
  mealsInDateRangeQ,
  getOverflowQ,
  getAvgCaloriesListInDateRangeQ
} = require("../utils/helper");

//  @desc       create a meal
//  @route      POST /api/v1/:<userRole>/meal/createMeal
//  @access     Private
exports.createMeal = asyncHandler(async (req, res, next) => {
  let user;
  // only needed cuz admins can create
  if (req.user.role === ROLES.ADMIN) {
    // the user should be present in the db
    if (req.body.takenBy) {
      const user = await UserModel.findById(req.body.takenBy);
      if (!user) {
        next(new ErrorResponse("no such user with this id"));
      }
    }
    user = req.body.takenBy;
  }
  if (req.user.role === ROLES.LEVEL1) {
    user = req.user._id;
  }

  const { foodName, foodCalorie, mealDate, mealTime } = req.body;

  // const formattedMealTime = new Date(); // at production
  const formattedMealTime = new Date(mealDate + "T" + mealTime);

  const meal = new MealModel({
    takenBy: user,
    foodName,
    foodCalorie,
    takenAt: formattedMealTime
  });

  const savedMeal = await meal.save();
  res.status(200).json({
    success: true,
    data: savedMeal
  });
});

//  @desc       get all meals
//  @route      GET /api/v1/admin/meal/getAllMeals
//  @access     Private: Admin
exports.getAllMeals = asyncHandler(async (req, res, next) => {
  const allMeals = await MealModel.find({ ...req.query });
  res.status(200).json({
    success: true,
    data: allMeals
  });
});

//  @desc       delete a meal
//  @route      DELETE /api/v1/admin/meal/
//  @access     Private
exports.deleteMeal = asyncHandler(async (req, res, next) => {
  if (!req.query._id) {
    next(new ErrorResponse("please provide _id in query params"));
  }

  const deletedMeal = await MealModel.findByIdAndRemove(req.query._id);

  if (!deletedMeal) {
    next(new ErrorResponse("No meals with this id"));
  }
  res.status(200).json({
    success: true,
    data: {}
  });
});

//  @desc       update a meal
//  @route      PUT /api/v1/admin/meal/
//  @access     Private
exports.updateMeal = asyncHandler(async (req, res, next) => {
  if (!req.query._id && !req.body._id) {
    next(new ErrorResponse("please provide _id in query params or body"));
  }

  // the user should be present in the db
  if (req.body.takenBy) {
    const user = await UserModel.findById(req.body.takenBy);
    if (!user) {
      next(new ErrorResponse("no such user with this id"));
    }
  }

  const updatedMeal = await MealModel.findByIdAndUpdate(
    req.query._id || req.body._id,
    {
      ...req.body
    },
    {
      new: true
    }
  );

  if (!updatedMeal) {
    next(new ErrorResponse("No meals with this id"));
  }
  res.status(200).json({
    success: true,
    data: updatedMeal
  });
});

//  @desc       get warning calorie
//  @route      GET /api/v1/users/meal/calorieOverflowByUser
//  @access     Private
exports.calorieOverflowByUser = asyncHandler(async (req, res, next) => {
  const overflowCalorieAgg = getOverflowQ(ObjectId(req.user._id));

  const mealsOverflow = await overflowCalorieAgg.exec();
  res.status(200).json({
    success: true,
    data: mealsOverflow
  });
});

//  @desc       get last 2 week meals
//  @route      GET /api/v1/users/meal/lastWeekMeals
//  @access     Private
exports.lastWeekMeals = asyncHandler(async (req, res, next) => {
  // creating dates for last 2 week
  const now = new Date();
  const lastWeek = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 7
  );
  const lastToLastWeek = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 14
  );

  // query
  const lastWeekMealsQuery = mealsInDateRangeQ(now, lastWeek);
  const lastTolastWeekMealsQuery = mealsInDateRangeQ(lastWeek, lastToLastWeek);

  const lastWeekMeals = await lastWeekMealsQuery;
  const lastTolastWeekMeals = await lastTolastWeekMealsQuery;
  res.status(200).json({
    success: true,
    data: { lastWeekMeals, lastTolastWeekMeals }
  });
});

//  @desc       get last weels avg calorie
//  @route      GET /api/v1/users/meal/lastWeekAvgCalorie
//  @access     Private
exports.lastWeekAvgCalorie = asyncHandler(async (req, res, next) => {
  // creating dates for last weeks
  const now = new Date();
  const lastWeek = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 7
  );

  // query
  const lastWeekCalQuery = getAvgCaloriesListInDateRangeQ(now, lastWeek);

  const lastWeekCal = await lastWeekCalQuery;

  res.status(200).json({
    success: true,
    data: lastWeekCal
  });
});


//  @desc       get all meals of user
//  @route      GET /api/v1/user/meal/getUserMeals
//  @access     Private
exports.getUserMeals = asyncHandler(async (req, res, next) => {
  const user = ObjectId(req.user._id);
  const allMeals = await MealModel.find({takenBy:user});
  res.status(200).json({
    success: true,
    data: allMeals
  });
});
