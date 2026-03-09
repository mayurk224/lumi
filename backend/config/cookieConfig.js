const COOKIE_NAME = "auth_token";

// Use secure: false in development (HTTP), true in production (HTTPS)
const isProduction = process.env.NODE_ENV === "production";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction, // Only secure in production
  sameSite: isProduction ? "none" : "strict", // strict for development
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  path: "/",
};

const CLEAR_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "strict",
  maxAge: 0, // Expire immediately
  path: "/",
};

module.exports = { COOKIE_NAME, COOKIE_OPTIONS, CLEAR_COOKIE_OPTIONS };
