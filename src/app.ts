import "./setup.js";
import cors from "cors";
import express, { json } from "express";
import "express-async-errors";
import router from "./routers/index.js";
import testsRouter from "./routers/testsRouter.js";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware.js";

const app = express();
app.use(json());
app.use(cors());
app.use(router);
if (process.env.NODE_ENV === "test") {
  app.use(testsRouter);
}
app.use(errorHandlerMiddleware);

export default app;
