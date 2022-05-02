import testRepository from "../repositories/testRepository.js";
import { notFoundError } from "../utils/errorUtils.js";

interface Filter {
  groupBy: "disciplines" | "teachers";
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

export default {
  find,
  updateViews,
};
