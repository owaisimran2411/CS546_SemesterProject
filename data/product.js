import * as helperMethods from "./../helper.js";
import { ObjectId } from "mongodb";
import { products } from "./../configuration/mongoCollections.js";
// Data function goes here

// below function is a template function, rename it!
const createProduct_Phase1 = async (
	productName,
	productOwnerId,
	productThumbnail,
	productID
) => {
	const { argumentProvidedValidation, primitiveTypeValidation } = helperMethods;

	let productInfo = undefined;
	// validating all the arguments

	argumentProvidedValidation(productOwnerId, "Owner ID");
	productOwnerId = helperMethods.checkId(productOwnerId);
	productID = helperMethods.checkId(productID);

	argumentProvidedValidation(productName, "Product name");
	productName = primitiveTypeValidation(productName, "Product name", "String");
	argumentProvidedValidation(productThumbnail, "Product Thumbnail");
	productThumbnail = primitiveTypeValidation(
		productThumbnail,
		"Product thumbnail",
		"String"
	);

	productInfo = {
		_id: productID,
		productName: productName,
		productThumbnail: productThumbnail,
		productOwnerId: productOwnerId,
		listingActive: false,
		comments: [],
	};

	const productCollection = await products();

	const newInsertInformation = await productCollection.insertOne(productInfo);
	if (!newInsertInformation.insertedId) throw "Insert failed!";
	return await getProductById(newInsertInformation.insertedId.toString());
};

const createProduct_Phase2 = async (
	productID,
	productOwnerId,
	productDescription,
	productCondition,
	productSerialNumber,
	productAskingPrice,
	productSupportedConsole,
	otherImages
) => {
	// console.log('function execution start')

	productID = helperMethods.checkId(productID);
	helperMethods.argumentProvidedValidation(productOwnerId, "productOwnerID");
	helperMethods.argumentProvidedValidation(
		productDescription,
		"productDescription"
	);
	helperMethods.argumentProvidedValidation(
		productCondition,
		"productCondition"
	);
	helperMethods.argumentProvidedValidation(
		productSerialNumber,
		"productSerialNumber"
	);
	helperMethods.argumentProvidedValidation(
		productAskingPrice,
		"productAskingPrice"
	);
	helperMethods.argumentProvidedValidation(
		productSupportedConsole,
		"productSupportedConsole"
	);
	helperMethods.argumentProvidedValidation(otherImages, "otherImage");

	productOwnerId = helperMethods.primitiveTypeValidation(
		productOwnerId,
		"productOwnerID",
		"String"
	);
	productDescription = helperMethods.primitiveTypeValidation(
		productDescription,
		"productDescription",
		"String"
	);
	productCondition = helperMethods.primitiveTypeValidation(
		productCondition,
		"productCondition",
		"String"
	);
	productSerialNumber = helperMethods.primitiveTypeValidation(
		productSerialNumber,
		"productSerialNumber",
		"String"
	);
	productAskingPrice = helperMethods.primitiveTypeValidation(
		productAskingPrice,
		"productAskingPrice",
		"Number"
	);
	productSupportedConsole = helperMethods.primitiveTypeValidation(
		productSupportedConsole,
		"productSupportedConsole",
		"String"
	);
	otherImages = helperMethods.primitiveTypeValidation(
		otherImages,
		"otherImage",
		"Array"
	);

	// console.log('Here')

	const productUpdate = {
		productDescription: productDescription,
		productCondition: productCondition,
		productSerialNumber: productSerialNumber,
		productSupportedConsole: productSupportedConsole,
		productAskingPrice: productAskingPrice,
		listingActive: true,
		otherImages: otherImages,
	};
	const productCollection = await products();

	const updateInfo = await productCollection.updateOne(
		{
			_id: productID,
		},
		{
			$set: productUpdate,
		}
	);
	if (updateInfo.modifiedCount > 1) throw "Unable to modify";
	return await getProductById(productID);
};

const getProductById = async (id) => {
	helperMethods.argumentProvidedValidation(id, "productID");

	id = helperMethods.primitiveTypeValidation(id, "productID", "String");
	// id = helperMethods.checkId(id);
	const productCollection = await products();
	const product = await productCollection.find({ _id: id }).toArray();

	if (product.length <= 0) throw "Error: Product not found";
	return product[0];
};

const getProducts = async (
	getAllFlag,
	countPerPull,
	pageNumber,
	searchFilters,
	sortFilters,
	fieldFilters
) => {
	// getAllFlag is used if all products needs to be fetched
	// countPerPull is used if all products does not need to be fetched
	// pageNumber is used if all products are not fetched and to skip some products
	// sortFilters to pass in sorting parameters

	helperMethods.argumentProvidedValidation(getAllFlag.toString(), "getAllFlag");
	getAllFlag = helperMethods.primitiveTypeValidation(
		getAllFlag,
		"getAllFlag",
		"Boolean"
	);

	let product = undefined;
	let sortingFilters = undefined;
	let fieldFilter = undefined;
	let searchFilter = undefined;

	const productCollection = await products();

	try {
		helperMethods.argumentProvidedValidation(sortFilters, "sortFilters");
		sortingFilters = helperMethods.primitiveTypeValidation(
			sortFilters,
			"sortFilters",
			"Object"
		);
	} catch (e) {
		sortingFilters = {};
	}

	try {
		helperMethods.argumentProvidedValidation(fieldFilters, "fieldFilters");
		// console.log(fieldFilters)
		if (typeof fieldFilters == "object") {
			fieldFilter = fieldFilters;
		} else {
			fieldFilter = {};
		}
	} catch (e) {
		fieldFilter = {};
	}

	try {
		helperMethods.argumentProvidedValidation(searchFilters, "searchFilters");
		// console.log(searchFilters)
		if (typeof searchFilters == "object") {
			searchFilter = searchFilters;
		} else {
			searchFilter = {};
		}
	} catch (e) {
		searchFilter = {};
	}

	// console.log(countPerPull, '=counterPerPull')
	// console.log(pageNumber, '=pageNumber')
	if (!getAllFlag) {
		helperMethods.argumentProvidedValidation(countPerPull, "countPerPull");
		helperMethods.argumentProvidedValidation(pageNumber, "pageNumber");

		countPerPull = helperMethods.primitiveTypeValidation(
			countPerPull,
			"countPerPull",
			"Number"
		);
		pageNumber = helperMethods.primitiveTypeValidation(
			pageNumber,
			"pageNumber",
			"Number"
		);

		if (countPerPull < 0) {
			countPerPull = 10;
		}
		if (pageNumber <= 0) {
			pageNumber = 1;
			product = await productCollection
				.find(searchFilter)
				.limit(countPerPull)
				.sort(sortFilters)
				.project(fieldFilter)
				.toArray();
		} else {
			product = await productCollection
				.find(searchFilter)
				.skip(pageNumber * countPerPull)
				.limit(countPerPull)
				.project(fieldFilter)
				.toArray();
		}
	} else {
		product = await productCollection
			.find(searchFilter)
			.sort(sortingFilters)
			.project(fieldFilter)
			.toArray();
	}

	if (product === undefined || product.length === 0) throw "No Product Found";
	return product;
};

const deleteProduct = async (productID) => {
	helperMethods.argumentProvidedValidation(productID, "productID");
	productID = helperMethods.primitiveTypeValidation(
		productID,
		"productID",
		"String"
	);
	productID = helperMethods.checkId(productID);

	const productCollection = await products();
	const productDelete = await productCollection.findOneAndDelete({
		_id: productID,
	});

	if (!productDelete)
		throw `Unable to Delete Product with Product ID: ${productID}`;
	return {
		productID: productID,
		status: "success",
		message: "Product Deletion Successful",
	};
};

const deleteProductWithSpecificOwnerID = async (ownerID) => {
	helperMethods.argumentProvidedValidation(ownerID, "ownerID");
	ownerID = helperMethods.primitiveTypeValidation(ownerID, "ownerID", "String");
	ownerID = helperMethods.checkId(ownerID);

	const productCollection = await products();
	const productDelete = await productCollection.deleteMany({
		productOwnerId: ownerID,
	});
	// console.log(productDelete)
	if (productDelete.deletedCount <= 0)
		throw `Unable to Delete Products with Owner ID: ${ownerID}`;
	return {
		ownerID: ownerID,
		status: "success",
		message: "Product Deletion Successful",
	};
};

const updateProductInformation = async (productID, updateObject) => {
	const updateProductInfo = {};

	if (updateObject.productName) {
		helperMethods.argumentProvidedValidation(
			updateObject.productName,
			"productName"
		);
		updateObject.productName = helperMethods.primitiveTypeValidation(
			updateObject.productName,
			"productName",
			"String"
		);
		updateProductInfo.productName = updateObject.productName;
	}

	if (updateObject.productDescription) {
		helperMethods.argumentProvidedValidation(
			updateObject.productDescription,
			"productDescription"
		);
		updateObject.productDescription = helperMethods.primitiveTypeValidation(
			updateObject.productDescription,
			"productDescription",
			"String"
		);
		updateProductInfo.productDescription = updateObject.productDescription;
	}

	// if (updateObject["listingActive"].toString() != undefined) {
	// 	try {
	// 		helperMethods.argumentProvidedValidation(
	// 			updateObject.listingActive.toString(),
	// 			"listingActive"
	// 		);
	// 		updateObject.listingActive = helperMethods.primitiveTypeValidation(
	// 			updateObject.listingActive,
	// 			"listingActive",
	// 			"Boolean"
	// 		);
	// 		updateProductInfo.listingActive = updateObject.listingActive;
	// 	} catch (e) {
	// 		console.log(e);
	// 	}
	// }

	if (updateObject.productCondition) {
		helperMethods.argumentProvidedValidation(
			updateObject.productCondition,
			"productCondition"
		);
		updateObject.productCondition = helperMethods.primitiveTypeValidation(
			updateObject.productCondition,
			"productCondition",
			"String"
		);
		updateProductInfo.productCondition = updateObject.productCondition;
	}

	if (updateObject.productSerialNumber) {
		helperMethods.argumentProvidedValidation(
			updateObject.productSerialNumber,
			"productSerialNumber"
		);
		updateObject.productSerialNumber = helperMethods.primitiveTypeValidation(
			updateObject.productSerialNumber,
			"productSerialNumber",
			"String"
		);
		updateProductInfo.productSerialNumber = updateObject.productSerialNumber;
	}

	if (updateObject.productSupportedConsole) {
		helperMethods.argumentProvidedValidation(
			updateObject.productSupportedConsole,
			"productSupportedConsole"
		);
		updateObject.productSupportedConsole =
			helperMethods.primitiveTypeValidation(
				updateObject.productSupportedConsole,
				"productSupportedConsole",
				"String"
			);
		updateProductInfo.productSupportedConsole =
			updateObject.productSupportedConsole;
	}

	if (updateObject.productAskingPrice) {
		helperMethods.argumentProvidedValidation(
			updateObject.productAskingPrice,
			"productAskingPrice"
		);
		updateObject.productAskingPrice = helperMethods.primitiveTypeValidation(
			updateObject.productAskingPrice,
			"productAskingPrice",
			"Number"
		);
		updateProductInfo.productAskingPrice = updateObject.productAskingPrice;
	}

	if ("listingActive" in updateObject) {
		updateProductInfo.listingActive = helperMethods.primitiveTypeValidation(
			updateObject.listingActive,
			"listingActive",
			"Boolean"
		);
	}

	if ("comments" in updateObject) {
		updateProductInfo.comments = helperMethods.primitiveTypeValidation(
			updateObject.comments,
			"comments",
			"Array"
		);
		for (let i = 0; i < updateProductInfo.comments.length; i++) {
			updateProductInfo.comments[i] = helperMethods.primitiveTypeValidation(
				updateProductInfo.comments[i],
				"comment",
				"String"
			);
		}
	}
	const productCollection = await products();
	const updateInfo = await productCollection.updateOne(
		{
			_id: productID,
		},
		{
			$set: updateProductInfo,
		}
	);

	return;
};

const methods = {
	createProduct_Phase1,
	createProduct_Phase2,
	getProductById,
	getProducts,
	deleteProduct,
	deleteProductWithSpecificOwnerID,
	updateProductInformation,
};
export default methods;
