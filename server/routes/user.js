const express = require("express");
const User = require("../models/User");
const { registerSchema } = require("../utils/validationSchema");
const validateForm = require("../middlewares/validateForm");
const { ApiError, handleSuccess } = require("../utils/apiStatus");

const userRouter = express.Router();

userRouter.post("/register", validateForm(registerSchema), (req, res, next) => {
  const { name, email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();
  User.findOne({ email: normalizedEmail }, (err, user) => {
    if(err) {
      next(ApiError.handleError(500, "Error has occurred while searching database"));
    } else if(user) {
      next(ApiError.handleError(400, "Email is already in use."));
    } else {
      const newUser = new User({ password, name: name.trim(), email: normalizedEmail });
      newUser.save(err => {
        if(err) {
          next(ApiError.handleError(500, "Error has occurred during registration"));
        } else {
          return handleSuccess(res, 201, "Successfully created account!");
        }
      });
    }
  });
});

module.exports = userRouter;
