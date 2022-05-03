import teacherRepository from "../repositories/teacherRepository.js";

async function getTeacherByDiscipline(disciplineId: number) {
  return await teacherRepository.getTeachersByDiscipline(disciplineId);
}

export function filterNull(disciplineId: number | string) {
  if (disciplineId === "null") return 0;
  else return Number(disciplineId);
}

export default {
  getTeacherByDiscipline,
  filterNull,
};
