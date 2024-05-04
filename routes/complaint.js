import { Router } from "express";
import * as helperMethods from "./../helper.js";
import { complaintData, userData } from "../data/index.js";
const { argumentProvidedValidation, primitiveTypeValidation } = helperMethods;

const router = Router();

router.route("/createComplaintSeller/:id").post(async (req, res) => {
	// console.log(req.body);
	const requestInfo = req.body;
	console.log("req body", requestInfo);
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
		return res.render("user/userInfo", {
			script_partial: "bid_validate_script",
			user,
		});
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

export default router;
