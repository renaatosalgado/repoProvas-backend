import supertest from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/database.js";
import userFactory from "./factories/userFactory.js";
import userBodyFactory from "./factories/userBodyFactory.js";
import { faker } from "@faker-js/faker";

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

describe("Users tests - POST /sign-in", () => {
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

describe("Update tests views - PUT /tests/:testId/update-views", () => {
  beforeEach(eraseUserTable());

  afterAll(prismaDiconnect());

  it("should return 201, given a valid testId", async () => {
    const testId = 1;

    const login = await getToken();

    const response = await supertest(app)
      .put(`/tests/${testId}/update-views`)
      .set("Authorization", `Bearer ${login.body.token}`);

    expect(response.status).toEqual(201);
  });

  it("should return 404, given an invalid testId", async () => {
    const testId = 200;

    const login = await getToken();

    const response = await supertest(app)
      .put(`/tests/${testId}/update-views`)
      .set("Authorization", `Bearer ${login.body.token}`);

    expect(response.status).toEqual(404);
  });

  it("should return 401, given invalid credentials", async () => {
    const testId = 1;

    const response = await supertest(app)
      .put(`/tests/${testId}/update-views`)
      .set("Authorization", `Bearer qualquer_token`);

    expect(response.status).toEqual(401);
  });
});

describe("Search bar - By Discipline", () => {
  beforeEach(eraseUserTable());

  afterAll(prismaDiconnect());

  it("should return 200 and an empty array", async () => {
    const disciplineName = "qualquer_um";

    const login = await getToken();

    const response = await supertest(app)
      .get(`/tests?groupBy=disciplines&disciplineName=${disciplineName}`)
      .set("Authorization", `Bearer ${login.body.token}`);

    const searchedDiscipline = response.body;

    expect(response.status).toEqual(200);
    expect(searchedDiscipline.tests[0].disciplines).toHaveLength(0);
  });

  it("should return 401, given invalid credentials", async () => {
    const disciplineName = "qualquer_um";

    const response = await supertest(app)
      .get(`/tests?groupBy=disciplines&disciplineName=${disciplineName}`)
      .set("Authorization", `Bearer qualquer_token`);

    expect(response.status).toEqual(401);
  });
});

describe("Adding new test", () => {
  beforeEach(eraseUserTable());

  afterAll(async () => {
    eraseTestsTable();
    prismaDiconnect();
  });

  it("should return 201, given a valid body", async () => {
    const body = {
      title: faker.lorem.word(),
      pdfUrl: faker.internet.url(),
      category: 1,
      discipline: 1,
      teacher: 1,
    };

    const login = await getToken();

    const response = await supertest(app)
      .post("/tests/add-new")
      .send(body)
      .set("Authorization", `Bearer ${login.body.token}`);

    expect(response.status).toEqual(201);
  });

  it("should return 409, given a duplicated test title", async () => {
    const body = {
      title: "Prova Teste",
      pdfUrl: "https://www.pudim.com.br",
      category: 1,
      discipline: 1,
      teacher: 1,
    };

    const login = await getToken();

    const response = await supertest(app)
      .post("/tests/add-new")
      .send(body)
      .set("Authorization", `Bearer ${login.body.token}`);

    expect(response.status).toEqual(409);
  });

  it("should return 422, given an invalid body", async () => {
    const body = {};

    const login = await getToken();

    const response = await supertest(app)
      .post("/tests/add-new")
      .send(body)
      .set("Authorization", `Bearer ${login.body.token}`);

    expect(response.status).toEqual(422);
  });

  it("should return 401, given invalid credentials", async () => {
    const body = {};

    const response = await supertest(app)
      .post("/tests/add-new")
      .send(body)
      .set("Authorization", `Bearer qualquer_token`);

    expect(response.status).toEqual(401);
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

function eraseTestsTable(): jest.ProvidesHookCallback {
  console.log("aqui");
  return async () => {
    await prisma.$executeRaw`TRUNCATE TABLE tests RESTART IDENTITY`;
  };
}

async function getToken() {
  const body = userBodyFactory();
  await userFactory(body);

  return await supertest(app).post("/sign-in").send(body);
}
