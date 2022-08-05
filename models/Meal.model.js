const mongoose = require("mongoose");

const MealSchema = new mongoose.Schema({
  takenBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  foodName: {
    type: String,
    required: true,
  },
  foodCalorie: {
    type: Number,
    required: true
  },
  takenAt: {
    type: Date,
    required: true
  },
  offset: {
    type: Number
  },
  takenAtLocal: {
    type: Date
  }
});

// ref
// https://www.mongodb.com/docs/v3.2/tutorial/model-time-data/
MealSchema.pre("save", function (next) {
  this.offset = this.takenAt.getTimezoneOffset();
  this.takenAtLocal = new Date(this.takenAt.getTime() - this.offset * 60000);
  next();
});

const MealModel = mongoose.model("Meal", MealSchema);

module.exports = MealModel;
