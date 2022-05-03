import teacherRepository from "../repositories/teacherRepository.js";
import testRepository from "../repositories/testRepository.js";
import { conflictError, notFoundError } from "../utils/errorUtils.js";

interface Filter {
  groupBy: "disciplines" | "teachers";
}

export interface AddNewTestData {
  title: string;
  pdfUrl: string;
  category: number | null;
  discipline: number | null;
  teacher: number | null;
}

async function find(
  filter: Filter,
  teacherName: string,
  disciplineName: string
) {
  if (filter.groupBy === "disciplines") {
    return testRepository.getTestsByDiscipline(disciplineName);
  } else if (filter.groupBy === "teachers") {
    return testRepository.getTestsByTeachers(teacherName);
  }
}

async function updateViews(testId: number) {
  verifyTestExistence(testId);

  await testRepository.incrementViews(testId);
}

async function verifyTestExistence(testId: number) {
  const test = await testRepository.findTestById(testId);

  if (!test) throw notFoundError("This test was not found.");
}

async function verifyTeacherDiscipline(
  teacherId: number,
  disciplineId: number
) {
  const existingTeacherDiscipline =
    await teacherRepository.verifyTeacherDiscipline(teacherId, disciplineId);

  if (!existingTeacherDiscipline) {
    await teacherRepository.createTeacherDiscipline(teacherId, disciplineId);
    const newTD = await teacherRepository.verifyTeacherDiscipline(
      teacherId,
      disciplineId
    );
    return newTD;
  }

  return existingTeacherDiscipline;
}

async function verifyDuplicatedTest(name: string) {
  const test = await testRepository.findTestByName(name);

  if (test) throw conflictError("This test is already in the system.");
}

async function addNewTest(
  name: string,
  pdfUrl: string,
  categoryId: number,
  teacherDisciplineId: number
) {
  await testRepository.createNew(name, pdfUrl, categoryId, teacherDisciplineId);
}

export default {
  find,
  updateViews,
  verifyTeacherDiscipline,
  addNewTest,
  verifyDuplicatedTest,
};
