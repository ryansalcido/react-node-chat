const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const User = require("../models/User");

const cookieExtractor = (req) => {
  let token = null;
  if(req && req.cookies) {
    token = req.cookies["access_token"];
  }
  return token;
};

/**
 * After authenticating via email and password, use JWT from cookie for
 * follow on requests to authenticate/authorize user.
 */
passport.use(new JwtStrategy({
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET
}, (payload, done) => {
  User.findById({ _id: payload.sub }, (err, user) => {
    if(err) {
      return done(err);
    } else if(user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
}));

//Initial authentication using email and password
passport.use(new LocalStrategy({ usernameField: "email", passwordField: "password" }, (email, password, done) => {
  const normalizedEmail = email.trim().toLowerCase();
  User.findOne({ email: normalizedEmail }, (err, user) => {
    if(err) {
      return done(err);
    } else if(!user) {
      return done(null, false);
    } else {
      return user.comparePassword(password, done);
    }
  });
}));
