const dbHandler = require("../utils/mockDbHandler");
const request = require("supertest");
const app = require("../express");

describe("Register express route", () => {
  beforeAll(async () => await dbHandler.createDB());

  afterAll(async () => await dbHandler.destroyDB());

  const user = {
    name: "John Doe",
    email: "johndoe@test.com",
    password: "johndoe123"
  };

  test("Register a new user", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send(user);
    expect(res.statusCode).toEqual(201);
    expect(res.body.error).toEqual(false);
  });

  test("Email already in use error", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send(user);
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Email is already in use");
  });

  test("Missing password field", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send({
        name: "John Doe",
        email: "johndoe@test.com"
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Required");
  });

  test("Invalid email address", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send({
        name: "John Doe",
        email: "johndoe",
        password: "johndoe123"
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Invalid email address");
  });

  test("Empty user input", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Required");
  });

  test("Name is too short", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send({
        name: "",
        email: "johndoe@test.com",
        password: "johndoe123" 
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Must be at least 3 characters");
  });

  test("Password is too short", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send({
        name: "John Doe",
        email: "johndoe@test.com",
        password: "123"
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Must be at least 8 characters");
  });
});
