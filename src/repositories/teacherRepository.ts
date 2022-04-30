import { prisma } from "../database.js";

async function getTeachersByDiscipline(disciplineId: number) {
  return await prisma.teacherDiscipline.findMany({
    where: {
      disciplineId: {
        equals: disciplineId,
      },
    },
    include: {
      teacher: true,
    },
    orderBy: {
      teacher: {
        name: "asc",
      },
    },
  });
}

export default {
  getTeachersByDiscipline,
};
