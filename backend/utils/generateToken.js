import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
    expiresIn: "90d", // e.g. 10m, 2h, 1d, 30d, 90d. Should correspond with cookie maxAge
  });

  // Note: Set JWT as HTTP-Only cookie
  res.cookie("jwt", token, {
    httpOnly: true, // Note: httpOnly only attribute prevents client side script (javascript, etc.) from being able to access data in the cookie
    secure: process.env.NODE_ENV !== "development", // Note: cookie can only be accesses from a secured site (https)
    sameSite: "strict", // Note: helps prevent cross site request attack, by requesting the browser to only send cookies where the requesting site is same site.
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
    // maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    // maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    // maxAge: 60 * 1000, // 1 min
  });
};

export default generateToken;
