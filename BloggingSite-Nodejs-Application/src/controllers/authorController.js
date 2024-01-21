const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authorModel = require("../models/authorModel");

//Rest api
const signup = async (req, res) => {
  try {
    const data = req.body;
    if (!data) {
      return res.send({
        status: false,
        message: "Please provide some data for user registration",
      });
    }
    const { fname, lname, title, email, password } = data;
    if (!fname) {
      return res.send({ status: false, message: "fname is required" });
    }
    if (!lname) {
      return res.send({ status: false, message: "lname is required" });
    }
    if (!title) {
      return res.send({ status: false, message: "title is required" });
    }
    if (!["Mr", "Mrs", "Miss", "mr", "mrs", "miss"].includes(title)) {
      return res.send({ status: false, message: "Please provide valid title" });
    }
    if (!email) {
      return res.send({ status: false, message: "email is required" });
    }
    const checkEmail = await authorModel.findOne({ email: email });
    if (checkEmail) {
      return res.send({ status: false, message: " Email already exist" });
    }
    if (!password) {
      return res.send({ status: false, message: "password is required" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    data.password = hashedPassword;
    const savedData = await authorModel.create(data);

    return res.send({
      status: true,
      message: "registration successfully",
      data: savedData,
    });
  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.send({ status: false, message: "email is required" });
  }
  if (!password) {
    return res.send({ status: false, message: "password is required" });
  }

  const verifyEmail = await authorModel.findOne({ email: email });
  if (!verifyEmail) {
    return res.send({ status: false, message: "please create account first" });
  }
  const pass = await bcrypt.compare(password, verifyEmail.password);
  if (!pass) {
    return res.send({
      status: false,
      message: "please enter correct password",
    });
  }
  const token = jwt.sign({ userId: verifyEmail._id }, process.env.SECRET_KEY);
  return res.send({
    status: true,
    message: "Login successfull",
    token: token,
    userId: verifyEmail._id,
  });
};

module.exports = { signup, login };
