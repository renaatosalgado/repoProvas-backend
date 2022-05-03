import categoryRepository from "../repositories/categoryRepository.js";

async function findMany() {
  return await categoryRepository.findMany();
}

export default {
  findMany,
};
