import * as helperMethods from "./../helper.js";
import { complaints } from "../configuration/mongoCollections.js";
import { ObjectId } from "mongodb";
import { complaintData, userData } from "./index.js";

const createComplaint = async (userId, sellerId, complaintText) => {
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

const getComplaintsByUserAndSellerId = async (userId, sellerId) => {
	const complaintsCollection = await complaints();
	const userComplaints = await complaintsCollection
		.find({
			userId: userId,
			sellerId: sellerId,
		})
		.toArray();
	return userComplaints;
};

const getComplaints = async (searchFilters, filters) => {
	const complaintsCollection = await complaints();
	const complaint = {};
	const filter = typeof filters === "object" ? filters : {};

	if (searchFilters.userId) {
		helperMethods.argumentProvidedValidation(searchFilters.userId, "userId");
		complaint.userId = helperMethods.primitiveTypeValidation(
			searchFilters.userId,
			"userId",
			"String"
		);
		complaint.userId = helperMethods.checkId(complaint.userId);
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
		complaint.sellerId = helperMethods.checkId(complaint.sellerId);
	}

	if (searchFilters.status) {
		helperMethods.argumentProvidedValidation(searchFilters.status, "status");
		complaint.status = helperMethods.primitiveTypeValidation(
			searchFilters.status,
			"status",
			"String"
		);
	}

	const searchResults = await complaintsCollection
		.find(complaint)
		.project(filter)
		.toArray();

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

	if (userComplaintsUpdated.modifiedCount != 1)
		throw "Unable to update complaint";

	return "success";
};

const methods = {
	createComplaint,
	getComplaintsByUserAndSellerId,
	updateComplaintStatus,
	getComplaints,
};

export default methods;
