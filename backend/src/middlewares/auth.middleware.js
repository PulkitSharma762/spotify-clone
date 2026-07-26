const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

async function authenticate(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired authentication token",
    });
  }
}

async function authUser(req, res, next) {
  return authenticate(req, res, next);
}

async function authArtist(req, res, next) {
  authenticate(req, res, () => {
    if (req.user.role !== "artist") {
      return res.status(403).json({
        message: "Artist access required",
      });
    }

    next();
  });
}

module.exports = {
  authUser,
  authArtist,
};