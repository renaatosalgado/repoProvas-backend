import { Router } from "express";
import teachersController from "../controllers/teachersController.js";
import { ensureAuthenticatedMiddleware } from "../middlewares/ensureAuthenticatedMiddleware.js";

const teacherRouter = Router();

teacherRouter.get(
  "/teachers/disciplines/:disciplineId",
  ensureAuthenticatedMiddleware,
  teachersController.getTeacherByDiscipline
);

export default teacherRouter;
