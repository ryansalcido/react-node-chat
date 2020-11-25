const dbHandler = require("../utils/mockDbHandler");
const request = require("supertest");
const app = require("../express");

async function registerUser() {
  const res = await request(app)
    .post("/chat/api/user/register")
    .send({
      name: "John Doe",
      email: "johndoe@test.com",
      password: "johndoe123"
    });
  return res;
}

describe("Register express route", () => {
  beforeAll(async () => await dbHandler.createDB());
  afterAll(async () => await dbHandler.destroyDB());

  test("Register a new user", async () => {
    const res = await registerUser();
    expect(res.statusCode).toEqual(201);
    expect(res.body.error).toEqual(false);
  });

  test("Email already in use error", async () => {
    const res = await registerUser();
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Email is already in use");
  });

  test("Email address is case-insensitive", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send({
        name: "John Doe",
        email: "JOHNDOE@test.com",
        password: "johndoe123"
      });
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

  test("Password is too short", async () => {
    const res = await request(app)
      .post("/chat/api/user/register")
      .send({
        name: "John Doe",
        email: "johndoe@test.com",
        password: "johndoe"
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Must be at least 8 characters");
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
});

describe("Login express route", () => {
  beforeAll(async () => await dbHandler.createDB());
  afterAll(async () => await dbHandler.destroyDB());

  //Register user first
  test("Register a new user", async () => {
    const res = await registerUser();
    expect(res.statusCode).toEqual(201);
    expect(res.body.error).toEqual(false);
  });

  //login with already registered user
  test("Login with already registered user", async () => {
    const res = await request(app)
      .post("/chat/api/user/login")
      .send({
        email: "johndoe@test.com",
        password: "johndoe123"
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.error).toEqual(false);
  });

  //login with unknown user
  test("Login with unknown user", async () => {
    const res = await request(app)
      .post("/chat/api/user/login")
      .send({
        email: "jest@jest.com",
        password: "jestUser123"
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body.payload).toEqual("Unauthorized");
  });

  //login with invalid password
  test("Login with invalid password", async () => {
    const res = await request(app)
      .post("/chat/api/user/login")
      .send({
        email: "johndoe@test.com",
        password: "johndoe"
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body.payload).toEqual("Unauthorized");
  });

  //login with missing email field
  test("Login with missing email", async () => {
    const res = await request(app)
      .post("/chat/api/user/login")
      .send({
        password: "johndoe"
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Required");
  });

  //login with missing password field
  test("Login with missing email", async () => {
    const res = await request(app)
      .post("/chat/api/user/login")
      .send({
        email: "johndoe@test.com"
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.payload).toEqual("Required");
  });
  //login with empty user input
});

// describe("Login express route", () => {
//   beforeAll(async () => await dbHandler.createDB());

//   afterAll(async () => await dbHandler.destroyDB());

//   //login with already registered user - pass
//   test("Login with already registered user", async () => {
//     const res = await request(app)
//       .post("/chat/api/user/login")
//       .send({
//         email: "johndoe@test.com",
//         password: "johndoe123"
//       });
//     expect(res.statusCode).toEqual(200);
//     expect(res.body.error).toEqual(false);
//   });

//   // login with invalid email - fail
//   test("Login with unknown user", async () => {
//     const res = await request(app)
//       .post("/chat/api/user/login")
//       .send({
//         email: "janedoe@test.com",
//         password: "janedoe1"
//       });
//     expect(res.statusCode).toEqual(401);
//     expect(res.body.payload).toEqual("Unauthorized");
//   });

//   //login with invalid password - fail
//   test("Login with invalid password", async () => {
//     const res = await request(app)
//       .post("/chat/api/user/login")
//       .send({
//         email: "janedoe@test.com",
//         password: "invalid"
//       });
//     expect(res.statusCode).toEqual(401);
//     expect(res.body.payload).toEqual("Unauthorized");
//   });

//   test("Login with missing email field", async () => {
//     const res = await request(app)
//       .post("/chat/api/user/login")
//       .send({
//         email: "janedoe@test.com"
//       });
//     expect(res.statusCode).toEqual(400);
//     expect(res.body.payload).toEqual("Required");
//   });

//   test("Login with missing password field", async () => {
//     const res = await request(app)
//       .post("/chat/api/user/login")
//       .send({
//         password: "invalid"
//       });
//     expect(res.statusCode).toEqual(400);
//     expect(res.body.payload).toEqual("Required");
//   });

//   test("Login with empty input", async () => {
//     const res = await request(app)
//       .post("/chat/api/user/login")
//       .send({});
//     expect(res.statusCode).toEqual(400);
//     expect(res.body.payload).toEqual("Required");
//   });
// });

// describe("isAuthenticated express route", () => {

//   //register, login, and isAuthenticated - success
//   //isAuthenticated route without logging in - fail
//   //
// });
