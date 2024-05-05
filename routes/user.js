import { Router, json } from "express";
import * as helperMethods from "./../helper.js";
import methods from "../data/user.js";
import { userData, productData, bidData } from "../data/index.js";

helperMethods.configureDotEnv();

const router = Router();

router.route("/my-products").get(async (req, res) => {
	try {
		const products = await productData.getProducts(
			true,
			1,
			1,
			{
				productOwnerId: "6632ac2938618897ebdc703b",
			},
			{},
			{
				productName: 1,
				_id: 1,
				productAskingPrice: 1,
			}
		);
		return res.render("user/viewListedProductUser", {
			docTitle: "My Listed Products",
			product: products,
		});
	} catch (e) {
		res.json({
			error: e,
		});
	}
});

router
	.route("/profile/update/:id")
	.get(async (req, res) => {
		try {
			const profileInformation = await userData.getUserById(req.params.id);
			// console.log(profileInformation);
			res.render("user/profileUpdate", {
				...profileInformation,
				docTitle: "Profile",
			});
		} catch (e) {
			res.json({
				error: e,
			});
		}
	})
	.post(async (req, res) => {
		try {
			const reqObj = {};
			console.log(req.body);
			if (req.body.bio) {
				let bio = undefined;
				bio = helperMethods.primitiveTypeValidation(
					req.body.bio,
					"Bio",
					"String"
				);
				reqObj.bio = bio;
			}
			if (req.body.phoneNumber) {
				let phoneNumber = undefined;
				phoneNumber = helperMethods.primitiveTypeValidation(
					Number(req.body.phoneNumber),
					"phoneNumber",
					"Number"
				);
				reqObj.phoneNumber = phoneNumber;
			}
			if (req.body.gender) {
				let gender = undefined;
				gender = helperMethods.primitiveTypeValidation(
					req.body.gender,
					"Gender",
					"String"
				);
				reqObj.gender = gender;
			}
			if (req.body.password) {
				let password = undefined;

				password = helperMethods.primitiveTypeValidation(
					req.body.password,
					"password",
					"String"
				);
				reqObj.password = password;
			}
			if (reqObj != {}) {
				console.log(reqObj);
				const updateUser = await userData.updateUser(req.params.id, reqObj);
			} else {
				res.json({
					error: "field not provided",
				});
			}

			// console.log(updateUser);
			return res.redirect("/login");
		} catch (e) {
			res.json({
				error: e,
			});
		}
	});
router
	.route("/register")
	.get(async (req, res) => {
		try {
			return res.render("register", {
				docTitle: "Register",
				script_partial: "register_validate_script",
			});
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
					username = username.toLowerCase();
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
						Number(req.body.phoneNumber),
						"phoneNumber",
						"Number"
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
						emailAddress.toLowerCase(),
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
			return res.render("login", {
				docTitle: "Login",
				script_partial: "login_validate_script",
			});
		} catch (error) {
			return res.status(404).json({ error: error });
		}
	})
	.post(async (req, res) => {
		if (req.body.username && req.body.password) {
			try {
				let username = helperMethods.primitiveTypeValidation(
					req.body.username,
					"Username",
					"String"
				);
				username = username.toLowerCase();
				let password = helperMethods.primitiveTypeValidation(
					req.body.password,
					"Password",
					"String"
				);
				helperMethods.checkIsValidPassword(password);
				const loginResult = await methods.userLogin(username, password);
				req.session.user = loginResult;
				return res.redirect("/product");
			} catch (error) {
				return res.status(400).json({ error: error });
			}
		} else {
			return res.status(400).json({
				error: "Incomplete Fields",
			});
		}
	});

router.route("/userInfo/:id").get(async (req, res) => {
	try {
		// console.log(req.params.id);
		const user = await userData.getUserById(req.params.id);
		return res.render(
			"user/userInfo",
			{
				script_partial: "bid_validate_script",
				user,
				docTitle: "Seller Profile",
			}
			// {product: product, userInfo}
		);
	} catch (e) {
		return res.status(404).json({ error: e });
	}
});

router.route("/profile").get(async (req, res) => {
	const username = req.session.user.username;
	try {
		const userInfo = await methods.getUserByUsername(username);
		const userProductInfo = await productData.getProducts(
			true,
			5,
			1,
			{ productOwnerId: userInfo._id },
			{},
			{}
		);
		const userBidInfo = await bidData.getUserBids(userInfo._id, false, 5);
		res.render("user/profile", {
			docTitle: "Profile Page",
			user: userInfo,
			products: userProductInfo,
			bids: userBidInfo,
		});
		return;
	} catch (e) {
		console.log("error", e);
		return res.status(400).json({ error: e });
	}
});
export default router;
