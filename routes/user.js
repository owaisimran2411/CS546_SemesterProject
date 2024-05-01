import { Router, json } from "express";
import * as helperMethods from "./../helper.js";
import methods from "../data/user.js";
import { productData } from "../data/index.js";
import { bidData } from "../data/index.js";
import { userData } from "../data/index.js";

helperMethods.configureDotEnv();

const router = Router();

router
  .route("/register")
  .get(async (req, res) => {
    try {
      return res.render("register", { docTitle: "Register" });
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  })
  .post(
    helperMethods
      .createMulterObject(
        helperMethods.createS3Client(
          process.env.AWS_ACCESS_KEY_ID,
          process.env.AWS_SECRET_ACCESS_KEY,
          process.env.S3_REGION
        ),
        process.env.S3_BUCKET,
        "profilePicture"
      )
      .single("profilePicture"),
    async (req, res) => {
      if (
        req.body.username &&
        req.body.password &&
        req.body.securityQuestionOne &&
        req.body.securityAnswerOne &&
        req.body.securityQuestionTwo &&
        req.body.securityAnswerTwo &&
        req.body.emailAddress &&
        req.body.phoneNumber &&
        req.body.gender &&
        req.body.bio &&
        req.file
      ) {
        try {
          let username = undefined;
          let password = undefined;
          let securityQuestionOne = undefined;
          let securityQuestionTwo = undefined;
          let securityAnswerOne = undefined;
          let securityAnswerTwo = undefined;
          let emailAddress = undefined;
          let phoneNumber = undefined;
          let gender = undefined;
          let bio = undefined;
          let profilePicture = undefined;

          username = helperMethods.primitiveTypeValidation(
            req.body.username,
            "username",
            "String"
          );
          password = helperMethods.primitiveTypeValidation(
            req.body.password,
            "password",
            "String"
          );
          securityQuestionOne = helperMethods.primitiveTypeValidation(
            req.body.securityQuestionOne,
            "Security Question1",
            "String"
          );
          securityQuestionTwo = helperMethods.primitiveTypeValidation(
            req.body.securityQuestionTwo,
            "securityQuestion2",
            "String"
          );
          securityAnswerOne = helperMethods.primitiveTypeValidation(
            req.body.securityAnswerOne,
            "securityAnswer1",
            "String"
          );
          securityAnswerTwo = helperMethods.primitiveTypeValidation(
            req.body.securityAnswerTwo,
            "securityAnswer2",
            "String"
          );
          emailAddress = helperMethods.primitiveTypeValidation(
            req.body.emailAddress,
            "emailAddress",
            "String"
          );
          phoneNumber = helperMethods.primitiveTypeValidation(
            req.body.phoneNumber,
            "phoneNumber",
            "String"
          );
          gender = helperMethods.primitiveTypeValidation(
            req.body.gender,
            "gender",
            "String"
          );
          bio = helperMethods.primitiveTypeValidation(
            req.body.bio,
            "bio",
            "String"
          );
          //checking for valid password
          helperMethods.checkIsValidPassword(password);

          profilePicture = req.file.location;
          const id = req.file.key.split("-")[0];

          const postResult = await methods.userSignUp(
            id,
            username.toLowerCase(),
            password,
            securityQuestionOne.toLowerCase(),
            securityAnswerOne.toLowerCase(),
            securityQuestionTwo.toLowerCase(),
            securityAnswerTwo.toLowerCase(),
            emailAddress,
            phoneNumber,
            gender.toLowerCase(),
            bio,
            profilePicture
          );

          if (postResult) {
            console.log(id);
            return res.redirect("/login");
          }

          //req.session.username = req.body.username;
          //return res.json(postResult);
        } catch (error) {
          return res.status(400).json({ error: error });
        }
      } else {
        return res.status(400).json({
          error: "Unable to Continue Signup",
        });
      }
    }
  );

router
  .route("/login")
  .get(async (req, res) => {
    try {
      return res.render("login", { docTitle: "Login" });
    } catch (error) {
      return res.status(404).json({ error: error });
    }
  })
  .post(async (req, res) => {
    if (req.body.username && req.body.password) {
      try {
        let username = helperMethods.primitiveTypeValidation(req.body.username, "Username", "String");
        let password = helperMethods.primitiveTypeValidation(req.body.password, "Password", "String");
        helperMethods.checkIsValidPassword(password);
        const loginResult = await methods.userLogin(
          username,
          password
        );
        req.session.username = loginResult;
        return res.json(req.session.username);
      } catch (error) {
        return res.status(400).json({ error: error });
      }
    } else {
      return res.status(400).json({
        error: "Incomplete Fields",
      });
    }
  });

router
  .route("/profile")
  .get(async (req, res) => {
    const username = req.session.username;
    try {
      const userInfo = await methods.getUserByUsername(username);
      const userProductInfo = await productData.getProducts(true, 5, 1, { productOwnerId: "662bfe6fac8facf5b4496d06" }, {}, {});
      const userBidInfo = await bidData.getUserBids(userInfo._id, false, 5);
      res.render('profile',
        {
          doctitle: 'Profile Page',
          user: userInfo,
          products: userProductInfo,
          bids: userBidInfo
        });
      return;
    }
    catch (e) {
      return res.status(400).json({ error: e });
    }
  });

export default router;
