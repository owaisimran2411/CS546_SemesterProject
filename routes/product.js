import { Router } from "express";
import * as helperMethods from "./../helper.js";
import { productData, userData, reviewsData } from "../data/index.js";

helperMethods.configureDotEnv();

const router = Router();

router
	.route("/")
	.get(async (req, res) => {
		let productList;
		try {
			productList = await productData.getProducts(true, 8, 1, 1, 1, 1);
			return res.render("product/index", {
				products: productList,
				docTitle: "Available Products",
				script_partial: "search_validate_script",
			});
		} catch (e) {
			return res.status(500).render("product/index", {
				products: productList,
				docTitle: "Available Products",
				script_partial: "search_validate_script",
				errorMessage: e,
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
				"coverImage"
			)
			.array("file", 5),
		async (req, res) => {
			console.log(req.files, typeof req.files);
			req.files.forEach((item) => {
				console.log(item.location);
			});
			return res.json({
				message: "Upload Successful",
			});
		}
	);

router.route("/search").post(async (req, res) => {
	let searchTerm = req.body.search;
	let productList;
	try {
		helperMethods.argumentProvidedValidation(searchTerm, "Search Term");
		searchTerm = helperMethods.primitiveTypeValidation(
			searchTerm,
			"Search Term",
			"String"
		);
	} catch (e) {
		return res.status(400).render("product/index", {
			products: productList,
			docTitle: "Available Products",
			errorMessage: e,
			script_partial: "search_validate_script",
		});
	}

	try {
		productList = await productData.getProducts(
			true,
			1,
			1,
			{ productName: new RegExp(searchTerm, "i") },
			1,
			1
		);
		return res.render("product/index", {
			products: productList,
			docTitle: "Search Results",
			script_partial: "search_validate_script",
		});
	} catch (e) {
		return res.status(500).render("product/index", {
			products: productList,
			docTitle: "Available Products",
			errorMessage: e,
			script_partial: "search_validate_script",
		});
	}
});

router
	.route("/new")
	.get(async (req, res) => {
		try {
			return res.render("product/productCreate", {
				uploadProcess1: true,
				docTitle: "Create New Product",
			});
		} catch (e) {
			return res.status(404).json({
				error: e,
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
				"productThumbnail"
			)
			.single("productThumbnail"),
		async (req, res) => {
			if (
				req.file &&
				req.body.productName //&&
				// req.session.user
			) {
				try {
					let productName = undefined;

					helperMethods.argumentProvidedValidation(
						req.body.productName,
						"productName"
					);
					productName = helperMethods.primitiveTypeValidation(
						req.body.productName,
						"productName",
						"String"
					);

					const coverImage = req.file.location;
					const id = req.file.key.split("-")[0];

					const productCreate = await productData.createProduct_Phase1(
						productName,
						req.session.user.id,
						coverImage,
						id
					);
					return res.redirect(`/product/new/${id}`);
				} catch (e) {
					return res.status(400).json({
						error: e,
					});
				}
			} else {
				return res.status(404).json({
					error: "All fields not present",
				});
			}
		}
	);

router
	.route("/new/:id")
	.get(async (req, res) => {
		res.render("product/productCreate", {
			uploadProcess2: true,
			productID: req.params.id,
			docTitle: "Create New Product",
		});
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
				"productOtherImages",
				true
			)
			.array("productOtherImages", 10),
		async (req, res) => {
			let otherImages = [];
			try {
				for (let i = 0; i < req.files.length; i++) {
					const copy =
						await helperMethods.moveFileFromTempToDestinationLocation(
							helperMethods.createS3Client(
								process.env.AWS_ACCESS_KEY_ID,
								process.env.AWS_SECRET_ACCESS_KEY,
								process.env.S3_REGION
							),
							req.files[i],
							req.params.id
						);
					// console.log(copy)
					otherImages.push(copy);
				}

				// Type validation
				if (
					req.body.productDescription &&
					req.body.productCondition &&
					req.body.productSerialNumber &&
					req.body.productSupportedConsole &&
					req.body.productAskingPrice
				) {
					let productDescription = helperMethods.primitiveTypeValidation(
						req.body.productDescription,
						"productDescription",
						"String"
					);
					let productCondition = helperMethods.primitiveTypeValidation(
						req.body.productCondition,
						"productCondition",
						"String"
					);
					let productSerialNumber = helperMethods.primitiveTypeValidation(
						req.body.productSerialNumber,
						"productSerialNumber",
						"String"
					);
					let productSupportedConsole = helperMethods.primitiveTypeValidation(
						req.body.productSupportedConsole,
						"productSupportedConsole",
						"String"
					);
					let productAskingPrice = helperMethods.primitiveTypeValidation(
						Number(req.body.productAskingPrice),
						"productAskingPrice",
						"Number"
					);

					const productUpdate = await productData.createProduct_Phase2(
						req.params.id,
						req.session.user.id,
						productDescription,
						productCondition,
						productSerialNumber,
						productAskingPrice,
						productSupportedConsole,
						otherImages
					);

					return res.json(productUpdate);
				} else {
					res.json({
						error: "fields missing",
					});
				}
			} catch (e) {
				return res.json({
					error: e,
				});
			}
		}
	);

router
	.route("/user/:action/:productID")
	.get(async (req, res) => {
		try {
			helperMethods.argumentProvidedValidation(req.params.action, "action");
			req.params.action = helperMethods.primitiveTypeValidation(
				req.params.action,
				"action",
				"String"
			);
			if (req.params.action != "update" && req.params.action != "delete") {
				return res.redirect("/my-products");
			} else {
				helperMethods.argumentProvidedValidation(req.params.productID, "id");
				req.params.id = helperMethods.primitiveTypeValidation(
					req.params.productID,
					"id",
					"String"
				);
				req.params.productID = helperMethods.checkId(req.params.productID);

				if (req.params.action.toLowerCase() === "update") {
					const productInformation = await productData.getProductById(
						req.params.productID
					);
					// console.log(productInformation);
					return res.render("user/productUpdate", {
						productInformation: productInformation,
						docTitle: "Update Product",
					});
				} else {
					const productUpdate = await productData.deleteProduct(req.params.id);
					if (typeof productUpdate === "object") {
						return res.redirect("/my-products");
					} else {
						res.json({
							error: productUpdate,
						});
					}
				}
			}
		} catch (e) {
			res.json({
				error: e,
			});
		}
	})
	.post(async (req, res) => {
		if (
			req.body.productName &&
			req.body.productDescription &&
			req.body.productSerialNumber &&
			req.body.productAskingPrice &&
			req.params.action == "update"
			//&&
			// req.session.user
		) {
			try {
				helperMethods.argumentProvidedValidation(
					req.body.productName,
					"productName"
				);
				let productName = helperMethods.primitiveTypeValidation(
					req.body.productName,
					"productName",
					"String"
				);

				let productDescription = helperMethods.primitiveTypeValidation(
					req.body.productDescription,
					"productDescription",
					"String"
				);

				let productSerialNumber = helperMethods.primitiveTypeValidation(
					req.body.productSerialNumber,
					"productSerialNumber",
					"String"
				);

				let productAskingPrice = helperMethods.primitiveTypeValidation(
					Number(req.body.productAskingPrice),
					"productAskingPrice",
					"Number"
				);

				console.log(req.body);

				const productUpdate = await productData.updateProductInformation(
					req.params.productID,
					{
						productName: productName,
						productAskingPrice: productAskingPrice,
						productSerialNumber: productSerialNumber,
						productDescription: productDescription,
					}
				);
				// console.log(productUpdate);
				console.log();
				return res.redirect(`/product/${req.params.productID}`);
			} catch (e) {
				return res.status(400).json({
					error: e,
				});
			}
		} else {
			return res.redirect("/my-products");
		}
	});
router
	.route("/:id")
	.get(async (req, res) => {
		// try {
		//   req.params.id = validation.checkId(req.params.id, 'Id URL Param');
		// } catch (e) {
		//   return res.status(400).json({error: e});
		// }
		try {
			const product = await productData.getProductById(req.params.id);
			const userInfo = await userData.getUserById(product.productOwnerId);
			const reviews = await reviewsData.getReviewByProduct(req.params.id);
			console.log(reviews);
			return res.render("product/single", {
				script_partial: "bid_validate_script",
				product: product,
				reviews: reviews,
				userInfo,
				docTitle: "Product Info",
			});
		} catch (e) {
			return res.status(404).json({ error: e });
		}
	})
	.post(async (req, res) => {
		try {
		} catch (e) {
			res.status(404).json({
				error: e,
			});
		}
	});

export default router;
