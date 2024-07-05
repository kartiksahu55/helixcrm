import express from "express";
import leadsController from "../Controllers/leadsController.js";
import { isLoggedIn, isAdmin } from "../Middlewares/authMiddleware.js";

const leadsRouter = express.Router();

leadsRouter
  .post("/create", isLoggedIn, leadsController.createLeads)
  .get("/fetch", isLoggedIn, leadsController.fetchLeads)
  .delete("/delete/:id", isLoggedIn, leadsController.deleteLeads)
  .patch("/update/:id", isLoggedIn, leadsController.updateLeads)
  .patch("/assignleads/:id", isAdmin, leadsController.assignLeads)

export default leadsRouter;


