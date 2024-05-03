import { Router } from "express";
import * as helperMethods from "./../helper.js";

import { productData, complaintData, userData } from "./../data/index.js";

helperMethods.configureDotEnv();

const router = Router();

router.route("/").get(async (req, res) => {});

router.route("/view-all-complaints").get(async (req, res) => {
	const complaints = await complaintData.getComplaints(
		{},
		{ _id: 1, complaintText: 1, status: 1 }
	);

	res.render("admin/view", {
		complaints: [
			{
				_id: 123,
				complaintText: "asdansdsnf",
				status: "Pending",
			},
			{
				_id: 345,
				complaintText: "asdansdsnf",
				status: "Active",
			},
			{
				_id: 678,
				complaintText: "asdansdsnf",
				status: "Pending",
			},
		],
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
	console.log(usersList);
	res.json({
		msg: "Hello",
	});
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
