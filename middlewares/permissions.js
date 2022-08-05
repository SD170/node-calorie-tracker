const jwt = require("jsonwebtoken");
const errorResponse = require("../utils/errorResponse");

exports.authenticate = (req, res, next) => {
  const AuthorizationHeader = req.header("Authorization");
  if (!AuthorizationHeader) {
    next(new errorResponse(`Access Denied`, 401));
  }

  const token = AuthorizationHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;

    // $oid for compass
    if (req.user._id.$oid) {
      req.user._id = req.user._id.$oid;
    }
    next();
  } catch (err) {
    next(new errorResponse(`Invalid Token`, 401));
  }
};

exports.checkRole = (role) => {
  return (req, res, next) => {
    if (req.user.role === role) {
      next();
    } else {
      next(new errorResponse(`Don't have permission`, 401));
    }
  };
};

exports.setRole = (role) => {
  return (req, res, next) => {
    req.role = role;
    next();
  };
};

// // $oid for compass
// exports.oidHandler = (req, res, next) => {
//   if (req.user._id.$oid) {
//     req.user._id = req.user._id.$oid;
//   }

//   next();
// };
