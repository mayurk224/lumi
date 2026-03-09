const COOKIE_NAME = "auth_token";

// Use secure: false in development (HTTP), true in production (HTTPS)
const isProduction = process.env.NODE_ENV === "production";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true, // Only secure in production
  sameSite: isProduction ? "none" : "lax", // lax for development to allow cross-origin
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

const CLEAR_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 0, // Expire immediately
};

module.exports = { COOKIE_NAME, COOKIE_OPTIONS, CLEAR_COOKIE_OPTIONS };
