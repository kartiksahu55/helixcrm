import express from "express";
import userController from "../Controllers/userController.js";
import { isLoggedIn, isAdmin } from "../Middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter
  // Referral User
  .post("/otprequest", userController.userOTP)
  .post("/signup", userController.userSignUp)
  .post("/login", userController.userLogin)
  .get("/logout", isLoggedIn, userController.userLogout)
  .get("/fetch", isLoggedIn, userController.userFetch)
  .patch("/update/:id", isLoggedIn, userController.userUpdateDetails)
  // Super Admin Router
  .post("/createsuperadmin", userController.superAdminUserCreate)
  // Admin Router
  .post("/createadmin/:id", isAdmin, userController.adminUserCreate)
  // Employee Router
  .post("/createemployee", isAdmin, userController.employeeUserCreate)
  .post("/createemployee", isAdmin, userController.uploadUserAvatar)
  .get("/fetchemployee", isAdmin, userController.employeeUserFetch)
  .patch(
    "/updateemployee/:id",
    isAdmin,
    userController.employeeUserUpdateDetails
  )
  .post("/uploaduseravatar", isLoggedIn, userController.uploadUserAvatar);

export default userRouter;
