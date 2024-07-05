import Jwt from "jsonwebtoken";
import AppError from "../Utils/errorUtils.js";

export const isLoggedIn = async (req, res, next) => {
  const token = req.cookies.token || null;

  if (!token) {
    // return res.status(401).json({
    //   success: false,
    //   message: "Unauthenticated! Please Login again.",
    // });
    return next(new AppError("Unauthenticated! Please Login again.", 401));
  }

  const user = await Jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = user;

  next();
};

export const isAdmin = async (req, res, next) => {
  const token = req.cookies.token || null;

  if (!token) {
    return next(new AppError("Unauthenticated! Please Login again.", 401));
  }

  try {
    const user = await Jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (user.role !== "admin" && user.role !== "super-admin") {
      return next(new AppError("Unauthorized! Only admin and super-admin are allowed.", 403));
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: error.message,
    });
  }
};
