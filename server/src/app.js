import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import errorMidleware from "../Middlewares/errorMiddleware.js";
import userRouter from "../Routers/userRouter.js";
import leadsRouter from "../Routers/leadsRouter.js";
import salesRouter from "../Routers/salesRouter.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["https://helixcrm.vercel.app"],
  })
);
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/leads", leadsRouter);
app.use("/api/v1/sales", salesRouter);

app.use(errorMidleware);

export default app;
