import { Request, Response } from "express";
import testService, { AddNewTestData } from "../services/testService.js";

async function find(req: Request, res: Response) {
  const { groupBy, teacherName, disciplineName } = req.query as {
    groupBy: string;
    teacherName: string;
    disciplineName: string;
  };

  if (groupBy !== "disciplines" && groupBy !== "teachers") {
    return res.sendStatus(400);
  }

  const tests = await testService.find(
    { groupBy },
    teacherName,
    disciplineName
  );
  res.send({ tests });
}

async function updateViews(req: Request, res: Response) {
  const { testId } = req.params;

  await testService.updateViews(Number(testId));
  res.sendStatus(201);
}

async function addNewTest(req: Request, res: Response) {
  const body: AddNewTestData = req.body;

  testService.verifyDuplicatedTest(body.title);

  const teacherDiscipline = await testService.verifyTeacherDiscipline(
    Number(body.teacher),
    Number(body.discipline)
  );

  await testService.addNewTest(
    body.title,
    body.pdfUrl,
    Number(body.category),
    teacherDiscipline.id
  );

  res.sendStatus(201);
}

export default {
  find,
  updateViews,
  addNewTest,
};
