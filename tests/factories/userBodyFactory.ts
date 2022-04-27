import { faker } from "@faker-js/faker";
import { CreateUserData } from "../../src/services/userService";

export default function userBodyFactory() {
  const body: CreateUserData = {
    email: faker.internet.email(),
    password: faker.internet.password(8),
  };
  
  return body;
}
