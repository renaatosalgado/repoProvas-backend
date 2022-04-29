import { Router } from "express";
import testController from "../controllers/testController.js";
import { ensureAuthenticatedMiddleware } from "../middlewares/ensureAuthenticatedMiddleware.js";

const testRouter = Router();

testRouter.get("/tests", ensureAuthenticatedMiddleware, testController.find);
testRouter.put(
  "/tests/:testId/update-views",
  ensureAuthenticatedMiddleware,
  testController.updateViews
);
// testRouter.get("/tests/searchBy/:disciplineName")
// testRouter.get("/tests/searchBy/:teacherName")

export default testRouter;
