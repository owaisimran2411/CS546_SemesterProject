import { Router, json } from "express";
import * as helperMethods from "./../helper.js";
import methods from "../data/user.js";
import { userData, productData, bidData } from "../data/index.js";

helperMethods.configureDotEnv();

const router = Router();

router.route("/my-products").get(async (req, res) => {
	let products;
	try {
		products = await productData.getProducts(
			true,
			1,
			1,
			{
				productOwnerId: req.session.user.id,
			},
			{},
			{
				productName: 1,
				_id: 1,
				productAskingPrice: 1,
				listingActive: 1,
			}
		);
		return res.render("user/viewListedProductUser", {
			docTitle: "My Listed Products",
			product: products,
		});
	} catch (e) {
		return res.status(404).render("user/viewListedProductUser", {
			docTitle: "My Listed Products",
			product: products,
			errorMessage: e,
		});
	}
});

router
	.route("/profile/update/:id")
	.get(async (req, res) => {
		try {
			const profileInformation = await userData.getUserById(req.params.id);
			// console.log(profileInformation);
			return res.render("user/profileUpdate", {
				...profileInformation,
				docTitle: "Profile",
			});
		} catch (e) {
			return res.status(500).render("errorPage", {
				errorMessage: e,
				BackLink_URL: `/userInfo/${req.params.id}`,
				BackList_Text: "Back to your profile",
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
				return res.status(400).json({
					error: "field not provided",
				});
			}

			// console.log(updateUser);
			return res.redirect("/login");
		} catch (e) {
			return res.status(500).render("errorPage", {
				errorMessage: e,
				BackLink_URL: `/userInfo/${req.params.id}`,
				BackList_Text: "Back to View Profile",
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
			return res.status(500).render("errorPage", {
				errorMessage: "Unable to register",
				BackLink_URL: `/register`,
				BackList_Text: "Retry to register",
			});
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
					return res.status(400).render("register", {
						docTitle: "Register",
						script_partial: "register_validate_script",
						errorMessage: error,
					});
				}
			} else {
				return res.status(500).render("register", {
					docTitle: "Register",
					script_partial: "register_validate_script",
					errorMessage: "Internal Error: Failed to register new user",
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
				return res.status(400).render("login", {
					docTitle: "Login",
					script_partial: "login_validate_script",
					errorMessage: "Missing or incorrect login information.",
				});
			}
		} else {
			return res.status(400).render("login", {
				docTitle: "Login",
				script_partial: "login_validate_script",
				errorMessage: "Missing or incorrect login information.",
			});
		}
	});

router.route("/userInfo/:id").get(async (req, res) => {
	console.log("param", req.params.id);
	console.log("user", req.session.user.id);
	if (req.params.id === req.session.user.id) {
		return res.redirect("/profile");
	}
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
	// console.log(username);
	let userInfo;
	let userProductInfo;
	let userBidInfo;
	try {
		userInfo = await methods.getUserByUsername(username);
		userProductInfo = await productData.getProducts(
			true,
			5,
			1,
			{ productOwnerId: userInfo._id },
			{},
			{}
		);
		userBidInfo = await bidData.getUserBids(userInfo._id, false, 5);
		return res.render("user/profile", {
			docTitle: "Profile Page",
			user: userInfo,
			products: userProductInfo,
			bids: userBidInfo,
		});
	} catch (e) {
		console.log("error", e);
		return res.status(400).render("user/profile", {
			docTitle: "Profile Page",
			user: userInfo,
			products: userProductInfo,
			bids: userBidInfo,
			errorMessage: e,
		});
	}
});
router.route("/profile/:username").get(async (req, res) => {
	if (req.session && req.session.admin) {
		const username = req.params.username;
		// console.log(username);
		let userInfo;
		let userProductInfo;
		let userBidInfo;
		try {
			userInfo = await methods.getUserById(username);
			userProductInfo = await productData.getProducts(
				true,
				5,
				1,
				{ productOwnerId: userInfo._id },
				{},
				{}
			);
			userBidInfo = await bidData.getUserBids(userInfo._id, false, 5);
			return res.render("user/profile", {
				docTitle: "Profile Page",
				user: userInfo,
				products: userProductInfo,
				bids: userBidInfo,
			});
		} catch (e) {
			console.log("error", e);
			return res.status(400).render("user/profile", {
				docTitle: "Profile Page",
				user: userInfo,
				products: userProductInfo,
				bids: userBidInfo,
				errorMessage: e,
			});
		}
	} else {
		res.redirect("/");
	}
});
router.route("/logout").get(async (req, res) => {
	req.session.destroy();
	res.redirect("/login");
});
export default router;
