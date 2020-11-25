require("../config/passport");
const express = require("express");
const passport = require("passport");
const JWT = require("jsonwebtoken");
const User = require("../models/User");
const { registerSchema, loginSchema } = require("../utils/validationSchema");
const validateForm = require("../middlewares/validateForm");
const { ApiError, handleSuccess } = require("../utils/apiStatus");

const userRouter = express.Router();

const signToken = (userID) => {
  return JWT.sign({
    iss: "react-node-chat",
    sub: userID
  }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

userRouter.post("/register", validateForm(registerSchema), (req, res, next) => {
  const { name, email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();
  User.findOne({ email: normalizedEmail }, (err, user) => {
    if(err) {
      next(ApiError.handleError(500, "Error has occurred while searching database"));
    } else if(user) {
      next(ApiError.handleError(400, "Email is already in use"));
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

userRouter.post("/login", 
  validateForm(loginSchema), passport.authenticate("local", { session: false }),
  (req, res, next) => {
    if(req.isAuthenticated()) {
      const { _id, name, email } = req.user;
      const token = signToken(_id);
      res.cookie("access_token", token, { httpOnly: true, sameSite: true });
      return handleSuccess(res, 200, {
        isAuthenticated: true, message: "Successfully logged in!", user: { name, email }
      });
    } else {
      return next(ApiError.handleError(401, "Invalid email or password"));
    }
  }
);

userRouter.get("/is-authenticated", passport.authenticate("jwt", { session: false }), (req, res) => {
  const { name, email } = req.user;
  return handleSuccess(res, 200, { isAuthenticated: true, message: "Authenticated", user: { name, email } });
});

module.exports = userRouter;
