const dbHandler = require("../utils/mockDbHandler");
const request = require("supertest");
const app = require("../express");

describe("/register route", () => {
  beforeAll(async () => await dbHandler.createDB());
  afterAll(async () => await dbHandler.destroyDB());

  //success
  test("register a new user - success", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send({ name: "John Doe", email: "johndoe@test.com", password: "johndoe123" });
    expect(res.statusCode).toEqual(201);
    expect(res.body.error).toEqual(false);
  });

  //email already in use
  test("email already in user - error", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send({ name: "John Doe", email: "johndoe@test.com", password: "johndoe123" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Email is already in use");
  });

  //empty input
  test("empty input - error", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Required");
  });

  //missing name
  test("missing name - error", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send({ email: "test@test.com", password: "testing123" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Required");
  });

  //missing email
  test("missing email - error", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send({ name: "testing", password: "testing123" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Required");
  });

  //missing password
  test("missing password - error", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send({ name: "testing", email: "test@test.com" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Required");
  });

  //invalid name
  test("invalid name - error", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send({ name: "t", email: "test@test.com", password: "testing123" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Must be at least 3 characters");
  });

  //invalid email
  test("invalid email - error", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send({ name: "testing", email: "test@", password: "testing123" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Invalid email address");
  });

  //invalid password
  test("invalid email - error", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send({ name: "testing", email: "test@test.com", password: "test" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Must be at least 8 characters");
  });
});

describe("/login route", () => {
  beforeAll(async () => await dbHandler.createDB());
  afterAll(async () => await dbHandler.destroyDB());

  //empty input
  test("empty input - error", async () => {
    const res = await request(app)
      .post("/chat/api/user/login")
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Required");
  });

  //unknown user
  test("login with unknwon user - error", async () => {
    const res = await request(app)
      .post("/chat/api/user/login")
      .send({ email: "janedoe@test.com", password: "janedoe123" });
    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual("Unauthorized");
  });

  //missing email
  test("missing email - error", async () => {
    const res = await request(app)
      .post("/chat/api/user/login")
      .send({ password: "johndoe123" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Required");
  });

  //missing password
  test("missing password - error", async () => {
    const res = await request(app)
      .post("/chat/api/user/login")
      .send({ password: "johndoe123" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Required");
  });

  //invalid email
  test("invalid email - error", async () => {
    const res = await request(app)
      .post("/chat/api/user/login")
      .send({ email: "johndoe", password: "johndoe123" });
    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual("Unauthorized");
  });

  //invalid password
  test("invalid email - error", async () => {
    const res = await request(app)
      .post("/chat/api/user/login")
      .send({ email: "johndoe@test.com", password: "johndoe" });
    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual("Unauthorized");
  });

  //success - register and login
  test("register a new user - success", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send({ name: "John Doe", email: "johndoe@test.com", password: "johndoe123" });
    expect(res.statusCode).toEqual(201);
    expect(res.body.error).toEqual(false);
  });

  test("login with registered user - success", async () => {
    const res = await request(app)
      .post("/chat/api/user/login")
      .send({ email: "johndoe@test.com", password: "johndoe123" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.error).toEqual(false);
  });
});

describe("/isAuthenticated route", () => {
  beforeAll(async () => await dbHandler.createDB());
  afterAll(async () => await dbHandler.destroyDB());

  let token = null;

  //error - not logged in yet
  test("unauthorized, not logged in - error", async () => {
    const res = await request(app)
      .get("/chat/api/user/is-authenticated");
    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual("Unauthorized");
  });

  //error - registered but not logged in yet
  test("register a new user - success", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send({ name: "John Doe", email: "johndoe@test.com", password: "johndoe123" });
    expect(res.statusCode).toEqual(201);
    expect(res.body.error).toEqual(false);
  });

  test("unauthorized, registered but not logged in - error", async () => {
    const res = await request(app)
      .get("/chat/api/user/is-authenticated");
    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual("Unauthorized");
  });

  //success - logged in
  test("login with registered user - success", async () => {
    const res = await request(app)
      .post("/chat/api/user/login")
      .send({ email: "johndoe@test.com", password: "johndoe123" });
    token = res.headers && res.headers["set-cookie"];
    expect(res.statusCode).toEqual(200);
    expect(res.body.error).toEqual(false);
  });

  test("is authenticated user - success", async () => {
    const res = await request(app)
      .get("/chat/api/user/is-authenticated")
      .set("Cookie", token);
    expect(res.statusCode).toEqual(200);
    expect(res.body.error).toEqual(false);
    expect(res.body.payload.isAuthenticated).toEqual(true);
  });
});
