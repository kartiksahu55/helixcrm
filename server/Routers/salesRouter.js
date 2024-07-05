import express from "express";
import salesController from "../Controllers/salesController.js";
import { isLoggedIn, isAdmin } from "../Middlewares/authMiddleware.js";

const salesRouter = express.Router();

salesRouter
  .post("/create", isLoggedIn, salesController.createSales)
  .get("/fetch", isAdmin, salesController.fetchSales)
  .patch("/update/:id", isAdmin, salesController.updateSales)
  .delete("/delete/:id", isAdmin, salesController.deleteSales);

export default salesRouter;
