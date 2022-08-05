const asyncHandler = require("../middlewares/async");
const mongoose = require("mongoose");
const UserModel = require("../models/User.model");

//  @desc       create single user
//  @route      POST /api/v1/users/createUser
//  @access     Public
exports.createUser = asyncHandler(async (req, res, next) => {

  const user = new UserModel({
    calorieLimit:req.body.calorieLimit,
    username:req.body.username,
    role:req.role   // from middleware
  });
  try {
    const savedUser = await user.save();
    res.status(200).json({
      success: true,
      data: savedUser,
    });
  } catch (err) {
    return next(err);
  }
});

