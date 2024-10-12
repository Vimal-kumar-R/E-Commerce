const mongoose = require('mongoose'); 
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please enter password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // you give + password permission another time
  },
  avatar: {
    // user profile picture
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
  },
  resetPasswordToken: String,
  resetPasswordTokenExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function (next) {
  // Check if the password is modified
  if (!this.isModified('password')) {
    return next();
  }

  // Hash the password if it's new or modified
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// JWT Token Generation
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET || 'Login@RLRV956698', {
    expiresIn: process.env.JWT_EXPIRES_TIME || '1h',
  });
};

// Compare Entered Password and Hashed Password
userSchema.methods.isValidPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate Reset Password Token
userSchema.methods.getResetToken = function () {
  const token = crypto.randomBytes(20).toString('hex');

  // Generate Hash and set to resetPasswordToken
  this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

  // Set token expire time
  this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
