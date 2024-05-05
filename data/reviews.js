import * as helperMethods from "./../helper.js";
import { reviews } from "./../configuration/mongoCollections.js";
import { ObjectId } from "mongodb";

const { argumentProvidedValidation, primitiveTypeValidation } = helperMethods;

const createNewReview = async (
	reviewText,
	reviewerId,
	reviewRating,
	productId
) => {
	argumentProvidedValidation(reviewText, "reviewText");
	argumentProvidedValidation(reviewerId, "reviewerId");
	argumentProvidedValidation(reviewRating, "reviewRating");
	argumentProvidedValidation(productId, "productId");

	reviewText = primitiveTypeValidation(reviewText, "reviewText", "String");
	reviewerId = primitiveTypeValidation(reviewerId, "reviewerId", "String");
	reviewRating = primitiveTypeValidation(
		Number(reviewRating),
		"reviewRating",
		"Number"
	);

	productId = primitiveTypeValidation(productId, "productId", "String");
	const reviewsCollection = await reviews();

	const review = await reviewsCollection
		.find({
			productId: productId,
			reviewerId: reviewerId,
		})
		.toArray();
	const id = undefined;
	console.log("14", review);
	if (review.length == 0) {
		// console.log("If");
		// id = helperMethods.generateObjectID();
		// console.log(id);
		const reviewsInsert = {
			reviewerId: reviewerId,
			reviewRating: reviewRating,
			reviewText: reviewText,
			productId: productId,
		};
		console.log(reviewsInsert);
		const reviewInsertion = await reviewsCollection.insertOne(reviewsInsert);
		console.log(reviewInsertion);
		if (!reviewInsertion.insertedId) {
			throw "Failed to insert review";
		} else {
			return;
		}
	} else {
		throw "Duplicate Review";
	}
};

const getReviewByProduct = async (productId) => {
	argumentProvidedValidation(productId, "productId");
	productId = primitiveTypeValidation(productId, "productId", "String");

	const reviewsCollection = await reviews();
	// console.log("I am here");
	const res = await reviewsCollection
		.find({
			productId: productId,
		})
		.project({
			_id: 0,
			productId: 0,
		})
		.toArray();
	if (res) {
		return res;
	} else {
		return [];
	}
};
const methods = { createNewReview, getReviewByProduct };
export default methods;
