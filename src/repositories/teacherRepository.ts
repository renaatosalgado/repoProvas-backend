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

async function verifyTeacherDiscipline(
  teacherId: number,
  disciplineId: number
) {
  return await prisma.teacherDiscipline.findFirst({
    where: {
      teacherId: {
        equals: teacherId,
      },
      AND: {
        disciplineId: {
          equals: disciplineId,
        },
      },
    },
  });
}

async function createTeacherDiscipline(
  teacherId: number,
  disciplineId: number
) {
  await prisma.teacherDiscipline.create({
    data: {
      teacherId: teacherId,
      disciplineId: disciplineId,
    },
  });
}

export default {
  getTeachersByDiscipline,
  verifyTeacherDiscipline,
  createTeacherDiscipline,
};
