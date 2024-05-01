import { Router } from "express";
import * as helperMethods from "./../helper.js";

import { productData } from "./../data/index.js";

helperMethods.configureDotEnv();

const router = Router();

router.route("/").get(async (req, res) => {});

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
	return res.render("admin/viewProducts", {
		products: productsListed,
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
export default router;
