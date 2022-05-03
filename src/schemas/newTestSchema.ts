import Joi from "joi";
import { AddNewTestData } from "../services/testService.js";

export const newTestSchema = Joi.object<AddNewTestData>({
  title: Joi.string().required(),
  pdfUrl: Joi.string().required(),
  category: Joi.number().required(),
  discipline: Joi.number().required(),
  teacher: Joi.number().required(),
});
