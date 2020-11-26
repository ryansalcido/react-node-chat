const dbHandler = require("../utils/mockDbHandler");
const request = require("supertest");
const app = require("../express");

describe("/register route", () => {
  beforeAll(async () => await dbHandler.createDB());
  afterAll(async () => await dbHandler.destroyDB());

  //success
  it("register - should successfully register user", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send({ name: "John Doe", email: "johndoe@test.com", password: "johndoe123" });
    expect(res.statusCode).toEqual(201);
    expect(res.body.error).toEqual(false);
  });

  //email already in use
  it("register - should throw 'Email already in use' error", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send({ name: "John Doe", email: "johndoe@test.com", password: "johndoe123" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Email is already in use");
  });

  //empty input
  it("register - should throw 'Required' error for empty input", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Required");
  });

  //missing name
  it("register - should throw 'Required' error for missing name field", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send({ email: "test@test.com", password: "testing123" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Required");
  });

  //missing email
  it("register - should throw 'Required' error for missing email field", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send({ name: "testing", password: "testing123" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Required");
  });

  //missing password
  it("register - should throw 'Required' error for missing password field", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send({ name: "testing", email: "test@test.com" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Required");
  });

  //invalid name
  it("register - should throw error for invalid name", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send({ name: "t", email: "test@test.com", password: "testing123" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Must be at least 3 characters");
  });

  //invalid email
  it("register - should throw error for invalid email address", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send({ name: "testing", email: "test@", password: "testing123" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Invalid email address");
  });

  //invalid password
  it("register - should throw error for not meeting password length requirement", async () => {
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
  it("login - should throw 'Required' error for empty input", async () => {
    const res = await request(app)
      .post("/chat/api/user/login")
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Required");
  });

  //unknown user
  it("login - should throw 'Unauthorized' error for invalid email/password", async () => {
    const res = await request(app)
      .post("/chat/api/user/login")
      .send({ email: "janedoe@test.com", password: "janedoe123" });
    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual("Unauthorized");
  });

  //missing email
  it("login - should throw 'Required' error for missing email field", async () => {
    const res = await request(app)
      .post("/chat/api/user/login")
      .send({ password: "johndoe123" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Required");
  });

  //missing password
  it("login - should throw 'Required' error for missing password field", async () => {
    const res = await request(app)
      .post("/chat/api/user/login")
      .send({ password: "johndoe123" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Required");
  });

  //invalid email
  it("login - should throw 'Unauthorized' error for invalid email address", async () => {
    const res = await request(app)
      .post("/chat/api/user/login")
      .send({ email: "johndoe", password: "johndoe123" });
    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual("Unauthorized");
  });

  //invalid password
  it("login - should throw 'Unauthorized' error for invalid password", async () => {
    const res = await request(app)
      .post("/chat/api/user/login")
      .send({ email: "johndoe@test.com", password: "johndoe" });
    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual("Unauthorized");
  });

  //success - register and login
  it("login - should successfully register user", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send({ name: "John Doe", email: "johndoe@test.com", password: "johndoe123" });
    expect(res.statusCode).toEqual(201);
    expect(res.body.error).toEqual(false);
  });

  it("login - should successfully login", async () => {
    const res = await request(app)
      .post("/chat/api/user/login")
      .send({ email: "johndoe@test.com", password: "johndoe123" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.error).toEqual(false);
  });
});

describe("/is-authenticated route", () => {
  beforeAll(async () => await dbHandler.createDB());
  afterAll(async () => await dbHandler.destroyDB());

  let token = null;

  //error - not logged in yet
  it("is-authenticated - should throw 'Unauthorized' error when no user has logged in", async () => {
    const res = await request(app)
      .get("/chat/api/user/is-authenticated");
    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual("Unauthorized");
  });

  //error - registered but not logged in yet
  it("is-authenticated - should successfully register user ", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send({ name: "John Doe", email: "johndoe@test.com", password: "johndoe123" });
    expect(res.statusCode).toEqual(201);
    expect(res.body.error).toEqual(false);
  });

  it("is-authenticated - should throw 'Unauthorized' error when user has registered, but not logged in", async () => {
    const res = await request(app)
      .get("/chat/api/user/is-authenticated");
    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual("Unauthorized");
  });

  //success - logged in
  it("is-authenticated - should successfully login", async () => {
    const res = await request(app)
      .post("/chat/api/user/login")
      .send({ email: "johndoe@test.com", password: "johndoe123" });
    token = res.headers && res.headers["set-cookie"];
    expect(res.statusCode).toEqual(200);
    expect(res.body.error).toEqual(false);
  });

  it("is-authenticated - should successfully show user is logged in", async () => {
    const res = await request(app)
      .get("/chat/api/user/is-authenticated")
      .set("Cookie", token);
    expect(res.statusCode).toEqual(200);
    expect(res.body.error).toEqual(false);
    expect(res.body.payload.isAuthenticated).toEqual(true);
  });
});

describe("/logout route for unauthenticated user", () => {
  beforeAll(async () => await dbHandler.createDB());
  afterAll(async () => await dbHandler.destroyDB());

  //not logged in, no error -> success
  it("logout - should return 200 status code even if user is not logged in", async () => {
    const res = await request(app)
      .get("/chat/api/user/logout");
    expect(res.statusCode).toEqual(200);
    expect(res.body.error).toEqual(false);
    expect(res.body.payload.isAuthenticated).toEqual(false);
  });
});

//"full user workflow - register, login, is-authenticated, logout"
describe("/register -> /login -> /is-authenticated -> /logout -> /is-authenticated", () => {
  beforeAll(async () => await dbHandler.createDB());
  afterAll(async () => await dbHandler.destroyDB());

  let token = null;

  it("should successfully register user", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send({ name: "John Doe", email: "johndoe@test.com", password: "johndoe123" });
    expect(res.statusCode).toEqual(201);
    expect(res.body.error).toEqual(false);
  });

  it("should successfully login", async () => {
    const res = await request(app)
      .post("/chat/api/user/login")
      .send({ email: "johndoe@test.com", password: "johndoe123" });
    token = res.headers && res.headers["set-cookie"];
    expect(res.statusCode).toEqual(200);
    expect(res.body.error).toEqual(false);
  });

  it("should successfully show user is logged in", async () => {
    const res = await request(app)
      .get("/chat/api/user/is-authenticated")
      .set("Cookie", token);
    expect(res.statusCode).toEqual(200);
    expect(res.body.error).toEqual(false);
    expect(res.body.payload.isAuthenticated).toEqual(true);
  });

  it("should successfully logout", async () => {
    const res = await request(app)
      .get("/chat/api/user/logout")
      .set("Cookie", token);
    expect(res.statusCode).toEqual(200);
    expect(res.body.error).toEqual(false);
    expect(res.body.payload.isAuthenticated).toEqual(false);
  });

  it("should throw 'Unauthorized' error once user has logged out", async () => {
    const res = await request(app)
      .get("/chat/api/user/is-authenticated");
    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual("Unauthorized");
  });
});
