import { prisma } from "../database.js";

async function getTestsByDiscipline(disciplineName: string) {
  return prisma.term.findMany({
    include: {
      disciplines: {
        where: {
          name: {
            startsWith: disciplineName,
            mode: "insensitive",
          },
        },
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

async function getTestsByTeachers(teacherName: string) {
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
    where: {
      teacher: {
        name: {
          startsWith: teacherName,
          mode: "insensitive",
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
