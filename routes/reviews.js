import { Router } from "express";
import * as helperMethods from "./../helper.js";

import methods from "./../data/reviews.js";

const router = Router();

router.route("/:productId").post(async (req, res) => {
	if (
		req.body.reviewText &&
		req.body.reviewStars &&
		req.body.productId &&
		req.session &&
		req.session.user &&
		req.session.user.id
	) {
		try {
			// console.log(req.body);
			let reviewText = undefined;
			let reviewStars = undefined;
			let productId = undefined;

			reviewText = helperMethods.primitiveTypeValidation(
				req.body.reviewText,
				"reviewText",
				"String"
			);

			reviewStars = helperMethods.primitiveTypeValidation(
				Number(req.body.reviewStars),
				"reviewStars",
				"Number"
			);

			productId = helperMethods.primitiveTypeValidation(
				req.params.productId,
				"productId",
				"String"
			);

			const reviewInsertion = await methods.createNewReview(
				reviewText,
				req.session.user.id,
				reviewStars,
				req.params.productId
			);
			// const reviewInsertion = await methods.createNewReview(
			// 	reviewText,
			// 	"6632ac2938618897ebdc703b",
			// 	reviewRating,
			// 	productId
			// );
			return res.redirect(`/product/${productId}`);
		} catch (e) {
			console.log("catch block");
			return res.status(400).json({
				error: e,
			});
		}
	} else {
		res.status(400).json({
			error: "Unable to process request",
		});
	}
});

export default router;
