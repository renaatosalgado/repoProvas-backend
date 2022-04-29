import userRepository from "../repositories/userRepository.js";

async function truncateTable() {
  await userRepository.truncateTable();
}

export default {
  truncateTable,
};
