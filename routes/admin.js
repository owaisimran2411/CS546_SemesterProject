import { Router } from "express";
import * as helperMethods from "./../helper.js";

import { productData, complaintData, userData } from "./../data/index.js";

import bcrypt from "bcryptjs";

helperMethods.configureDotEnv();

const router = Router();

router.route("/").get(async (req, res) => {
	return res.render("admin/homePage", {
		adminAuthenticated: true,
		docTitle: "Admin Home",
	});
});

router
	.route("/login")
	.get(async (req, res) => {
		if (req.session && req.session.user && req.session.user.adminAuthenicated) {
			return res.redirect("/");
		} else {
			return res.render("admin/userLogin", {
				adminAuthenticated: false,
				docTitle: "Admin Login",
			});
		}
	})
	.post(async (req, res) => {
		if (
			req.body.username &&
			req.body.username.trim().length > 0 &&
			req.body.username.toLowerCase().trim() === process.env.ADMIN_USERNAME &&
			req.body.password &&
			req.body.password.trim().length > 0 &&
			req.body.password.trim() === process.env.ADMIN_PASSWORD
		) {
			req.session.admin = {
				user: req.body.username.trim().toLowerCase(),
				adminAuthenicated: "authenticated",
			};
			return res.redirect("/admin");
		} else {
			return res.render("admin/userLogin", {
				errorMessage: "Incorrect Username (OR) Password",
				docTitle: "Admin Login",
			});
		}
	});

router.route("/view-all-complaints").get(async (req, res) => {
	const complaints = await complaintData.getComplaints(
		{ complaintType: "Seller" },
		{ _id: 1, complaintText: 1, status: 1 }
	);
	// console.log(complaints);
	return res.render("admin/view", {
		complaints: complaints,
		viewComplaints: true,
		adminAuthenticated: true,
		docTitle: "Admin - View All Complaints (Seller)",
	});
});

router.route("/view-all-complaints-product").get(async (req, res) => {
	const complaints = await complaintData.getComplaints(
		{ complaintType: "Product" },
		{ _id: 1, complaintText: 1, status: 1 }
	);
	// console.log(complaints);
	return res.render("admin/view", {
		complaints: complaints,
		viewProductComplaints: true,
		adminAuthenticated: true,
		docTitle: "Admin View All Complaints (Products)",
	});
});

router.route("/view-all-products").get(async (req, res) => {
	const productsListed = await productData.getProducts(
		true,
		1,
		1,
		{},
		{},
		{
			_id: 1,
			productName: 1,
			productAskingPrice: 1,
			listingActive: 1,
			productAskingPrice: 1,
		}
	);
	// console.log(productsListed)
	return res.render("admin/view", {
		products: productsListed,
		viewProducts: true,
		adminAuthenticated: true,
		docTitle: "Admin View All Products",
	});
});

router.route("/view-all-users").get(async (req, res) => {
	const usersList = await userData.getUser();
	// console.log(usersList);
	return res.render("admin/view", {
		users: usersList,
		viewUsers: true,
		adminAuthenticated: true,
		docTitle: "Admin View All Users",
	});
});

router.route("/user/:userID/:action").get(async (req, res) => {
	try {
		const userUpdate = await userData.updateUser(req.params.userID, {
			userActive: req.params.action === "disable" ? false : true,
		});
		const disableProducts = await productData.getProducts(
			true,
			1,
			1,
			{
				productOwnerId: req.params.userID,
			},
			{},
			{
				_id: 1,
			}
		);
		for (let i = 0; i < disableProducts.length; i++) {
			await productData.updateProductInformation(disableProducts[i]._id, {
				listingActive: req.params.action === "enable" ? true : false,
			});
		}
		return res.redirect("/admin/view-all-users");
	} catch (e) {
		return res.status(500).render("errorPage.handlebars", {
			errorMessage: e,
			BackLink_URL: "/admin/view-all-users",
			BackList_Text: "Back to View All Users",
		});
	}
});
router.route("/product/:productID/:action").get(async (req, res) => {
	const productUpdate = await productData.updateProductInformation(
		req.params.productID,
		{
			listingActive: req.params.action === "enable" ? true : false,
		}
	);
	return res.redirect("/admin/view-all-products");
});

router.route("/complaint/:complaintID/:statusUpdate").get(async (req, res) => {
	try {
		const complaintUpdate = await complaintData.updateComplaintStatus(
			req.params.complaintID,
			req.params.statusUpdate
		);
		console.log("Admin", complaintUpdate);
		return res.redirect(complaintUpdate);
	} catch (e) {
		return res.status(500).render("errorPage.handlebars", {
			errorMessage: e,
			BackLink_URL: "/admin/",
			BackList_Text: "Back to Home Page",
		});
	}
});
export default router;
