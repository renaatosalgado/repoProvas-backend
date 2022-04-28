import { prisma } from "../database.js";

async function getTestsByDiscipline() {
  return prisma.term.findMany({
    include: {
      disciplines: {
        include: {
          teacherDisciplines: {
            include: {
              teacher: true,
              tests: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });
}

async function getTestsByTeachers() {
  return prisma.teacherDiscipline.findMany({
    include: {
      teacher: true,
      discipline: true,
      tests: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      teacher: {
        name: "asc",
      },
    },
  });
}

async function incrementViews(testId: number) {
  await prisma.test.update({
    data: {
      views: {
        increment: 1,
      },
    },
    where: {
      id: testId,
    },
  });
}

export default {
  getTestsByDiscipline,
  getTestsByTeachers,
  incrementViews,
};
