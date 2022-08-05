// creating JWT on the fly

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const colors = require("colors");

//Loading env vars
dotenv.config({ path: "./config.env" });

const params = {
  role: "user",
  username: "user2",
  calorieLimit: 1000,
  _id: "62ed760cd3c9eb52e23dbd95",
  __v: 0
};


//jwt sign
const token = jwt.sign(params, process.env.TOKEN_SECRET, {
  expiresIn: "365d"
});

console.log(token.red);
