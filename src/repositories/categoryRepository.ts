import { prisma } from "../database.js";

async function findMany() {
  return prisma.category.findMany(
    {
      orderBy: {
        id: "asc"
      }
    }
  );
}

export default {
  findMany,
};
