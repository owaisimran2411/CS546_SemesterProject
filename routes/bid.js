import { Router } from "express";
import * as helperMethods from "./../helper.js";
import { bidData, productData, userData } from "../data/index.js";
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
		return res.status(500).render("errorPage", {
			errorMessage: e,
			BackLink_URL: `/product/${productId}`,
			BackList_Text: "Back to View All products",
		});
	}
	try {
		// console.log(productId);
		await bidData.createBid(productId, req.session.user.id, bidAmount);
	} catch (e) {
		return res.status(500).render("errorPage", {
			errorMessage: e,
			BackLink_URL: `/product/${productId}`,
			BackList_Text: "Back to View All products",
		});
	}
	return res.status(200).json({ bidAmount: bidAmount });
});

router.route("/:productID").get(async (req, res) => {
	let fullBidInfo = []
	try {
		const bids = await bidData.getBidByProductId(req.params.productID);
		let bidArray = bids.Bids;
		for(let i = 0; i < bidArray.length; i++){
			let currentBidObject = bidArray[i];
			const userId = currentBidObject.userID.toString();
			const userInfo = await userData.getUserById(userId);

			const bidAmount = currentBidObject.bidAmount;

			const bidObjectToAdd = {
				username: userInfo.username,
				email: userInfo.emailAddress,
				bidAmount: bidAmount
			}
			fullBidInfo.push(bidObjectToAdd);
		}
		const productInformation = await productData.getProductById(
			req.params.productID
		);
		// console.log(bids, productInformation);
		return res.render("user/viewProductBids", {
			docTitle: "View Current Bids",
			bids: fullBidInfo,
			product: productInformation,
		});
	} catch (e) {
		return res.status(500).render("errorPage", {
			errorMessage: e,
			BackLink_URL: `/product`,
			BackList_Text: "Home Page",
		});
	}
});

export default router;
