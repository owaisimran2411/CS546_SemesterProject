import { Router } from "express";
import * as helperMethods from "./../helper.js";
import { bidData } from "../data/index.js";
const { argumentProvidedValidation, primitiveTypeValidation } = helperMethods;

const router = Router();

router.route("/createBid").post(async (req, res) => {
	console.log("user:", req.session.user);
	let productId = req.body.productId;
	let bidAmount = req.body.bidAmount;

	try {
		bidAmount = parseFloat(bidAmount);

		// productId = helperMethods.checkId(productId);
		argumentProvidedValidation(bidAmount, "Bid Ammount");
		bidAmount = primitiveTypeValidation(bidAmount, "Bid Amount", "Number");
		bidAmount = helperMethods.checkBidAmount(bidAmount);
	} catch (e) {
		return res.status(500).render("errorPage.handlebars", {
			errorMessage: e,
			BackLink_URL: `/product/${productId}`,
			BackList_Text: "Back to View All products",
		});
	}
	try {
		// console.log(productId);
		await bidData.createBid(productId, req.session.user.id, bidAmount);
	} catch (e) {
		return res.status(500).render("errorPage.handlebars", {
			errorMessage: e,
			BackLink_URL: `/product/${productId}`,
			BackList_Text: "Back to View All products",
		});
	}
	return res.status(200).json({ bidAmount: bidAmount });
});

export default router;
