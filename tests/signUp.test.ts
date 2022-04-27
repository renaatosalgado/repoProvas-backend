import supertest from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/database.js";
import userFactory from "./factories/userFactory.js";
import userBodyFactory from "./factories/userBodyFactory.js";

describe("Users tests - POST /sign-up", () => {
  beforeEach(eraseUserTable());

  afterAll(prismaDiconnect());

  it("should return 201 and persist the user, given a valid body", async () => {
    const body = userBodyFactory();

    const result = await supertest(app).post("/sign-up").send(body);

    const createdUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    expect(result.status).toEqual(201);
    expect(createdUser).not.toBeNull();
  });

  it("should return 422, given an invalid body", async () => {
    const body = {};

    const result = await supertest(app).post("/sign-up").send(body);

    const users = await prisma.user.findMany();

    expect(result.status).toEqual(422);
    expect(users).toMatchObject({});
  });

  it("should return 409, given a duplicate email", async () => {
    const body = userBodyFactory();

    await supertest(app).post("/sign-up").send(body);
    const result = await supertest(app).post("/sign-up").send(body);

    const user = await prisma.user.findMany({
      where: {
        email: body.email,
      },
    });

    expect(result.status).toEqual(409);
    expect(user.length).toEqual(1);
    //expect(user).toEqual(expect.objectContaining(body));
  });
});

describe("Users tests - POST /sign-up", () => {
  beforeEach(eraseUserTable());

  afterAll(prismaDiconnect());

  it("should return 200 and a token, given valid credentials", async () => {
    const body = userBodyFactory();

    await userFactory(body);

    const response = await supertest(app).post("/sign-in").send(body);

    expect(response.status).toEqual(200);
    expect(typeof response.body.token).toEqual("string");
  });

  it("should return 401, given invalid email", async () => {
    const body = userBodyFactory();

    await userFactory(body);

    const response = await supertest(app)
      .post("/sign-in")
      .send({
        ...body,
        email: "qualquer_email",
      });

    expect(response.status).toEqual(401);
    expect(response.body.token).toBeUndefined();
  });

  it("should return 401, given invalid password", async () => {
    const body = userBodyFactory();

    await userFactory(body);

    const response = await supertest(app)
      .post("/sign-in")
      .send({
        ...body,
        password: "senha_louca",
      });

    expect(response.status).toEqual(401);
    expect(response.body.token).toBeUndefined();
  });
});

function prismaDiconnect(): jest.ProvidesHookCallback {
  return async () => {
    await prisma.$disconnect();
  };
}

function eraseUserTable(): jest.ProvidesHookCallback {
  return async () => {
    await prisma.$executeRaw`TRUNCATE TABLE users;`;
  };
}
