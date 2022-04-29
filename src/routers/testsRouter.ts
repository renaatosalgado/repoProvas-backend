import { Router } from "express";
import testsController from "../controllers/testsController.js";

const testsRouter = Router();

testsRouter.post("/reset-user", testsController.resetUsers);

export default testsRouter;
