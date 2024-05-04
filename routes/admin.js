import { Router } from "express";
import * as helperMethods from "./../helper.js";

import { productData, complaintData, userData } from "./../data/index.js";

helperMethods.configureDotEnv();

const router = Router();

router.route("/").get(async (req, res) => {});

router.route("/view-all-complaints").get(async (req, res) => {
	const complaints = await complaintData.getComplaints(
		{ complaintType: "Seller" },
		{ _id: 1, complaintText: 1, status: 1 }
	);
	// console.log(complaints);
	res.render("admin/view", {
		complaints: complaints,
		viewComplaints: true,
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
	});
});

router.route("/view-all-users").get(async (req, res) => {
	const usersList = await userData.getUser();
	// console.log(usersList);
	res.render("admin/view", {
		users: usersList,
		viewUsers: true,
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
		return res.json({
			error: e,
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
	const complaintUpdate = await complaintData.updateComplaintStatus(
		req.params.complaintID,
		req.params.statusUpdate
	);
	return res.redirect("/admin/view-all-complaints");
});
export default router;
