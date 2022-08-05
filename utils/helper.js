const MealModel = require("../models/Meal.model");

// 1 hr buffer period for end date (1week + 1hr)
exports.mealsInDateRangeQ = (startDate, endDate) => {
  return MealModel.find({
    takenAt: {
      $lte: startDate,
      $gt: endDate
    }
  });
};

exports.getOverflowQ = (usrId) => {
  return MealModel.aggregate([
    {
      $match: {
        takenBy: usrId
      }
    },
    {
      // finding the user of the meal
      $lookup: {
        from: "users",
        localField: "takenBy",
        foreignField: "_id",
        as: "takenBy"
      }
    },
    {
      $unwind: {
        path: "$takenBy"
      }
    },
    {
      $group: {
        _id: {
          $dayOfYear: "$takenAt" // adding total foodcalorie by date from timestamp
        },
        totalCalorieTaken: {
          $sum: "$foodCalorie"
        },
        takenAt: {
          $first: "$takenAt"
        },
        takenAtLocal: {
          $first: "$takenAtLocal"
        },
        takenBy: {
          $first: "$takenBy._id"
        },
        calorieLimit: {
          $first: "$takenBy.calorieLimit"
        }
      }
    },
    {
      $match: {
        $expr: {
          $gt: ["$totalCalorieTaken", "$calorieLimit"]
        }
      }
    },
    {
      $sort: {
        takenAt: 1
      }
    }
  ]);
};
exports.getAvgCaloriesListInDateRangeQ = (startDate, endDate) => {
  return MealModel.aggregate([
    {
      $match: {
        takenAt: {
          $lte: startDate,
          $gt: endDate
        }
      }
    },
    {
      $group: {
        _id: "$takenBy",
        averageCalorie: {
          $avg: "$foodCalorie"
        }
      }
    }
  ]);
};
