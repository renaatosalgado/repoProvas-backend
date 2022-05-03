import { Router } from "express";
import testController from "../controllers/testController.js";
import { ensureAuthenticatedMiddleware } from "../middlewares/ensureAuthenticatedMiddleware.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import { newTestSchema } from "../schemas/newTestSchema.js";

const testRouter = Router();

testRouter.get("/tests", ensureAuthenticatedMiddleware, testController.find);
testRouter.put(
  "/tests/:testId/update-views",
  ensureAuthenticatedMiddleware,
  testController.updateViews
);
testRouter.post(
  "/tests/add-new",
  ensureAuthenticatedMiddleware,
  validateSchemaMiddleware(newTestSchema),
  testController.addNewTest
);

export default testRouter;
