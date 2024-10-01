const express = require("express");
const Router = express.Router();
// const { generateToken, verifyToken } = require("../controller/jwt");
const { getAllUserData, userSignupForm, userLoginForm, forgatePassword, createNewPassword } = require("../controller/userController");

Router.get('/', getAllUserData);
Router.post("/usersignup", userSignupForm);
Router.post("/userlogin", userLoginForm);
Router.post("/sendmail", forgatePassword);
Router.post("/createnewpassword/:Email", createNewPassword);

module.exports = Router;
