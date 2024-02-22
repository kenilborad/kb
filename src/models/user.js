const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    tokens: [{
      token: {
        type: String,
        required: true,
      },
    }],
    resetPwdToken: {
      type: String,
      default: null,
    },
    resetPwdExpires: {
      type: mongoose.Schema.Types.Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// eslint-disable-next-line func-names
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString(), email: user.email }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
