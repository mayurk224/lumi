const COOKIE_NAME = "auth_token";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  path: "/",
};

const CLEAR_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
};

module.exports = { COOKIE_NAME, COOKIE_OPTIONS, CLEAR_COOKIE_OPTIONS };
