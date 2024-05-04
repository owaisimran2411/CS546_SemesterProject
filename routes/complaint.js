import { Router } from "express";
import * as helperMethods from "./../helper.js";
import { complaintData, productData, userData } from "../data/index.js";
const { argumentProvidedValidation, primitiveTypeValidation } = helperMethods;

const router = Router();

router.route("/createComplaintSeller/:id").post(async (req, res) => {
	// console.log(req.body);
	const requestInfo = req.body;
	let sellerId = req.params.id;
	let complaintMessage = requestInfo.complaintMessage;
	let userId = req.session.user.id;
	let user;
	try {
		user = await userData.getUserById(sellerId);
	} catch (e) {
		console.log("error", e);
		return res.status(404).json({ error: e });
	}
	try {
		userId = helperMethods.checkId(userId);
		argumentProvidedValidation(complaintMessage, "Complaint Message");
		complaintMessage = primitiveTypeValidation(
			complaintMessage,
			"Complaint Message",
			"String"
		);
	} catch (e) {
		console.log("error", e);

		return res.status(400).render("user/userInfo", {
			script_partial: "bid_validate_script",
			user,
			hasErrors: true,
			errorMessage: e,
		});
	}
	try {
		await complaintData.createComplaintSeller(
			userId,
			sellerId,
			complaintMessage
		);
		return res.redirect(`/userInfo/${sellerId}`);
	} catch (e) {
		console.log("error", e);

		return res.status(500).render("user/userInfo", {
			script_partial: "bid_validate_script",
			user,
			hasErrors: true,
			errorMessage: e,
		});
	}
});

router
	.route('/createComplaintProduct/:id')
	.post(async(req, res)=>{
		const requestInfo = req.body;
		let productId = req.params.id;
		let complaintMessage = requestInfo.complaintMessage;
		let userId = req.session.user.id;
		let userInfo;
		let product;
		try{
			product = await productData.getProductById(productId);
			userInfo = await userData.getUserById(product.productOwnerId);
		}
		catch(e){
			return res.status(500).render("product/single", {
				script_partial: "bid_validate_script",
				product: product,
				userInfo,
				hasErrors: true,
				errorMessage: e
			});
		}
		try{
			userId = helperMethods.checkId(userId);
			argumentProvidedValidation(complaintMessage, "Complaint Message");
			complaintMessage = primitiveTypeValidation(
				complaintMessage,
				"Complaint Message",
				"String"
			);
		}
		catch(e){
			return res.status(400).render("product/single", {
				script_partial: "bid_validate_script",
				product: product,
				userInfo,
				hasErrors: true,
				errorMessage: e
			});
		}
		try{
			await complaintData.createComplaintProduct(
				userId, 
				productId,
				complaintMessage
			);
			return res.redirect(`/product/${productId}`);
		}
		catch(e){
			return res.status(500).render("product/single", {
				script_partial: "bid_validate_script",
				product: product,
				userInfo,
				hasErrors: true,
				errorMessage: e
			});
		}
	});
export default router;
