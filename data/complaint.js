import * as helperMethods from "./../helper.js";
import { complaints } from "../configuration/mongoCollections.js";
import { ObjectId } from "mongodb";
import { complaintData, productData, userData } from "./index.js";

const createComplaintSeller = async (userId, sellerId, complaintText) => {
	const { argumentProvidedValidation, primitiveTypeValidation } = helperMethods;
	argumentProvidedValidation(userId, "userId");
	argumentProvidedValidation(sellerId, "sellerId");
	userId = primitiveTypeValidation(userId, "userId", "String");
	sellerId = primitiveTypeValidation(sellerId, "sellerId", "String");

	const complaintsCollection = await complaints();

	let complaint = await complaintsCollection
		.find({
			userId: userId,
			sellerId: sellerId,
		})
		.toArray();
	if (complaint.length !== 0) {
		throw "error: Complaint with given user and seller already exists";
	}

	const _id = helperMethods.generateObjectID();
	const newComplaint = {
		_id: _id,
		userId: userId,
		sellerId: sellerId,
		complaintText: complaintText,
		status: "Pending",
		complaintType: "Seller",
	};

	const user = await userData.getUserById(userId);
	const seller = await userData.getUserById(sellerId);

	if (!user || !seller) {
		throw "error: User or seller not found.";
	}

	const insertInfo = await complaintsCollection.insertOne(newComplaint);

	if (insertInfo.insertedCount === 0) {
		throw "Error: Could not add complaint.";
	}

	return _id;
};

const createComplaintProduct = async (userId, productId, complaintText) => {
	const { argumentProvidedValidation, primitiveTypeValidation } = helperMethods;
	argumentProvidedValidation(userId, "userId");
	argumentProvidedValidation(productId, "productId");
	userId = primitiveTypeValidation(userId, "userId", "String");
	productId = primitiveTypeValidation(productId, "productId", "String");

	const complaintsCollection = await complaints();

	let complaint = await complaintsCollection
		.find({
			userId: userId,
			productId: productId,
		})
		.toArray();
	if (complaint.length !== 0) {
		throw "error: Complaint with given user and seller already exists";
	}

	const _id = helperMethods.generateObjectID();
	const newComplaint = {
		_id: _id,
		userId: userId,
		productId: productId,
		complaintText: complaintText,
		status: "Pending",
		complaintType: "Product",
	};

	const user = await userData.getUserById(userId);
	const product = await productData.getProductById(productId);

	if (!user || !product) {
		throw "error: User or product not found.";
	}

	const insertInfo = await complaintsCollection.insertOne(newComplaint);

	if (insertInfo.insertedCount === 0) {
		throw "Error: Could not add complaint.";
	}

	return _id;
};

const getComplaintsByUserAndSellerId = async (userId, sellerId) => {
	const complaintsCollection = await complaints();
	const userComplaints = await complaintsCollection
		.find({
			userId: userId,
			sellerId: sellerId,
			complaintType: "Seller",
		})
		.toArray();
	return userComplaints;
};

const getComplaintsByUserAndProductId = async (userId, productId) => {
	const complaintsCollection = await complaints();
	const userComplaints = await complaintsCollection
		.find({
			userId: userId,
			productId: productId,
			complaintType: "Product",
		})
		.toArray();
	return userComplaints;
};

const getComplaints = async (searchFilters, filters) => {
	const complaintsCollection = await complaints();
	const complaint = {};
	const filter = typeof filters === "object" ? filters : {};

	if (searchFilters.complaintType) {
		helperMethods.argumentProvidedValidation(
			searchFilters.complaintType,
			"complaintType"
		);
		complaint.complaintType = helperMethods.primitiveTypeValidation(
			searchFilters.complaintType,
			"complaintType",
			"String"
		);
	}

	if (searchFilters._id) {
		helperMethods.argumentProvidedValidation(searchFilters._id, "_id");
		complaint._id = new ObjectId(
			helperMethods.primitiveTypeValidation(searchFilters._id, "_id", "String")
		);
	}

	if (searchFilters.userId) {
		helperMethods.argumentProvidedValidation(searchFilters.userId, "userId");
		complaint.userId = helperMethods.primitiveTypeValidation(
			searchFilters.userId,
			"userId",
			"String"
		);
		// complaint.userId = helperMethods.checkId(complaint.userId);
	}

	if (searchFilters.sellerId) {
		helperMethods.argumentProvidedValidation(
			searchFilters.sellerId,
			"sellerId"
		);
		complaint.sellerId = helperMethods.primitiveTypeValidation(
			searchFilters.sellerId,
			"sellerId",
			"String"
		);
		// complaint.sellerId = helperMethods.checkId(complaint.sellerId);
	}

	if (searchFilters.productId) {
		helperMethods.argumentProvidedValidation(
			searchFilters.productId,
			"productId"
		);
		complaint.productId = helperMethods.primitiveTypeValidation(
			searchFilters.productId,
			"productId",
			"String"
		);
		// complaint.sellerId = helperMethods.checkId(complaint.sellerId);
	}

	if (searchFilters.status) {
		helperMethods.argumentProvidedValidation(searchFilters.status, "status");
		complaint.status = helperMethods.primitiveTypeValidation(
			searchFilters.status,
			"status",
			"String"
		);
	}
	let searchResults = {};
	if (filter != {}) {
		searchResults = await complaintsCollection
			.find(complaint)
			.project(filter)
			.toArray();
	} else {
		searchResults = await complaintsCollection.find(complaint).toArray();
	}

	return searchResults;
};

const updateComplaintStatus = async (complaintId, updateStatus) => {
	complaintId = helperMethods.checkId(complaintId);
	helperMethods.argumentProvidedValidation(updateStatus, "updateStatus");
	updateStatus = helperMethods.primitiveTypeValidation(
		updateStatus,
		"updateStatus",
		"String"
	);
	const complaintsCollection = await complaints();
	const userComplaintsUpdated = await complaintsCollection.updateOne(
		{
			_id: new ObjectId(complaintId),
		},
		{
			$set: {
				status: updateStatus,
			},
		}
	);

	if (userComplaintsUpdated.matchedCount != 1)
		throw "Unable to update complaint";

	const data = await getComplaints({ _id: complaintId });
	return data[0].complaintType === "Seller"
		? "/admin/view-all-complaints"
		: "/admin/view-all-complaints-product";
};

const methods = {
	createComplaintSeller,
	createComplaintProduct,
	getComplaintsByUserAndSellerId,
	getComplaintsByUserAndProductId,
	updateComplaintStatus,
	getComplaints,
};

export default methods;
