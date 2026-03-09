const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { blacklistToken } = require("../utils/tokenBlacklist");
const { COOKIE_NAME, COOKIE_OPTIONS, CLEAR_COOKIE_OPTIONS } = require("../config/cookieConfig");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already in use" });
      }
      return res.status(400).json({ message: "Username already taken" });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = generateToken(user._id);

    // Set JWT as HttpOnly cookie
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    // Return user data WITHOUT token in body
    res.status(201).json({
      message: 'Registration successful',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: "Your account has been banned" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    // Set JWT as HttpOnly cookie
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    // Return user data WITHOUT token in body
    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    // Extract token from HttpOnly cookie (set by cookie-parser)
    const token = req.cookies[COOKIE_NAME];

    if (token) {
      // Blacklist the token in Redis so it cannot be reused
      // even if someone copies it before the cookie is cleared
      const blacklisted = await blacklistToken(token);
      console.log(`[Auth] Token blacklisted on logout: ${blacklisted}`);
    }

    // Clear the auth cookie from the browser
    // Must use same path, httpOnly, secure, sameSite as when it was set
    res.clearCookie(COOKIE_NAME, CLEAR_COOKIE_OPTIONS);

    return res.status(200).json({
      message: 'Logged out successfully.',
      cookieCleared: true,
    });
  } catch (err) {
    console.error('[Auth] Logout error:', err.message);

    // Still clear the cookie even if blacklisting fails
    res.clearCookie(COOKIE_NAME, CLEAR_COOKIE_OPTIONS);

    return res.status(200).json({
      message: 'Logged out. Token cleanup may be incomplete.',
      cookieCleared: true,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
};
