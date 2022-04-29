import testsService from "../services/testsService.js";

async function resetUsers() {
  await testsService.truncateTable();
}

export default {
  resetUsers,
};
