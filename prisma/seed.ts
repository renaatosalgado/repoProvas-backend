import { prisma } from "../src/database.js";

async function seedDB() {
  await prisma.category.upsert({
    where: { name: "P1 - teste" },
    update: {},
    create: {
      name: "P1 - teste",
    },
  });

  await prisma.term.upsert({
    where: { number: 1 },
    update: {},
    create: {
      number: 1,
    },
  });

  await prisma.teacher.upsert({
    where: { name: "Professor Teste" },
    update: {},
    create: {
      name: "Professor Teste",
    },
  });

  await prisma.discipline.upsert({
    where: { name: "Matéria Teste" },
    update: {},
    create: {
      name: "Matéria Teste",
      termId: 1,
    },
  });

  await prisma.teacherDiscipline.upsert({
    where: { id: 1 },
    update: {},
    create: {
      teacherId: 1,
      disciplineId: 1,
    },
  });

  await prisma.test.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Prova Teste",
      pdfUrl: "https://www.pudim.com.br",
      categoryId: 1,
      teacherDisciplineId: 1,
      views: 0,
    },
  });
}

seedDB()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
