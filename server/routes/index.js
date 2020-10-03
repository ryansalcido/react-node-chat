const baseRouter = require("express").Router();
const userRouter = require("./user");

baseRouter.use("/user", userRouter);

module.exports = baseRouter;
