const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model");

const COOKIE_NAME = "token";

function createToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

function formatUser(user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
}

async function registerUser(req, res, next) {
  try {
    let { username, email, password } = req.body;

    username = username?.trim();
    email = email?.trim().toLowerCase();

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email and password are required",
      });
    }

    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({
        message: "Username must be between 3 and 30 characters",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const existingUser = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({
          message: "An account with this email already exists",
        });
      }

      return res.status(409).json({
        message: "This username is already taken",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    const token = createToken(user);

    res.cookie(COOKIE_NAME, token, getCookieOptions());

    return res.status(201).json({
      message: "Account created successfully",
      user: formatUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Username or email already exists",
      });
    }

    next(error);
  }
}

async function loginUser(req, res, next) {
  try {
    let { email, username, password } = req.body;

    email = email?.trim().toLowerCase();
    username = username?.trim();

    if ((!email && !username) || !password) {
      return res.status(400).json({
        message: "Email or username and password are required",
      });
    }

    const query = email ? { email } : { username };

    const user = await userModel.findOne(query).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email/username or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email/username or password",
      });
    }

    const token = createToken(user);

    res.cookie(COOKIE_NAME, token, getCookieOptions());

    return res.status(200).json({
      message: "Login successful",
      user: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
}

async function logoutUser(req, res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({
    message: "Logout successful",
  });
}

async function getCurrentUser(req, res, next) {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
};