const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.pre("save", function(next) {
  if(this.isModified("email")) {
    this.email = this.email.trim().toLowerCase();
  }
  if(!this.isModified("password")) {
    next();
  } else {
    bcrypt.hash(this.password, 10, (err, passwordHash) => {
      if(err) {
        next(err);
      } else {
        this.password = passwordHash;
        next();
      }
    });
  }
});

userSchema.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if(err) cb(err);
    
    cb(null, isMatch ? this : isMatch);
  });
};

module.exports = mongoose.model("User", userSchema);
