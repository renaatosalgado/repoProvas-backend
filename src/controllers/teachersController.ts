import { Request, Response } from "express";
import teacherService from "../services/teacherService.js";

async function getTeacherByDiscipline(req: Request, res: Response) {
  const { disciplineId } = req.params;

  const filteredDisciplineId = teacherService.filterNull(disciplineId);

  const teachers = await teacherService.getTeacherByDiscipline(
    Number(filteredDisciplineId)
  );

  res.status(200).send({ teachers });
}

export default {
  getTeacherByDiscipline,
};
