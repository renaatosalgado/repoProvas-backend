import testRepository from "../repositories/testRepository.js";

interface Filter {
  groupBy: "disciplines" | "teachers";
}

async function find(filter: Filter, teacherName: string, disciplineName: string) {
  if (filter.groupBy === "disciplines") {
    return testRepository.getTestsByDiscipline(disciplineName);
  } else if (filter.groupBy === "teachers") {
    return testRepository.getTestsByTeachers(teacherName);
  }
}

async function updateViews(testId: number) {
  await testRepository.incrementViews(testId);
}

export default {
  find,
  updateViews,
};
