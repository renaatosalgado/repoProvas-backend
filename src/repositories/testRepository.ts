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

async function findTestById(testId: number) {
  return prisma.test.findUnique({
    where: {
      id: testId,
    },
  });
}

async function findTestByName(name: string) {
  return prisma.test.findFirst({
    where: {
      name: name,
    },
  });
}

async function createNew(
  name: string,
  pdfUrl: string,
  categoryId: number,
  teacherDisciplineId: number
) {
  await prisma.test.create({
    data: {
      name,
      pdfUrl,
      categoryId,
      teacherDisciplineId,
      views: 0,
    },
  });
}

export default {
  getTestsByDiscipline,
  getTestsByTeachers,
  incrementViews,
  findTestById,
  createNew,
  findTestByName
};
