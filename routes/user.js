import { Router, json } from "express";
import * as helperMethods from "./../helper.js";
import methods from "../data/user.js";

const router = Router();

router
  .route("/register")
  .get(async (req, res) => {
    try {
      res.render("register", { docTitle: "Register" });
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  })
  .post(async (req, res) => {
    try {
      const postResult = await methods.userSignUp(
        req.body.username,
        req.body.password,
        req.body.securityQuestionOne,
        req.body.securityAnswerOne,
        req.body.securityQuestionTwo,
        req.body.securityAnswerTwo,
        req.body.emailAddress,
        req.body.phoneNumber,
        req.body.gender,
        req.body.bio,
        req.body.profilePicture
      );
      //req.session.username = req.body.username;
      return res.json(postResult);
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  });

router
  .route("/login")
  .get(async (req, res) => {
    try {
      res.render("login", { docTitle: "Login" });
    } catch (error) {
      return res.status(404).json({ error: error });
    }
  })
  .post(async (req, res) => {
    try {
      const loginResult = await methods.userLogin(
        req.body.username,
        req.body.password
      );
       req.session.username = loginResult;
      return res.json(req.session.username);
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  });

export default router;
