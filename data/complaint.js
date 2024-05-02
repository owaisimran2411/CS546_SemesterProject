import * as helperMethods from "./../helper.js";
import { complaints } from "../configuration/mongoCollections.js";
import { ObjectId } from "mongodb";
import { userData } from "./index.js";
import { Collection } from "mongoose";

const createComplaint = async (userId, sellerId, complaintText) => {
	const { argumentProvidedValidation, primitiveTypeValidation } = helperMethods;
	argumentProvidedValidation(userId, "userId");
	argumentProvidedValidation(sellerId, "sellerId");
	userId = primitiveTypeValidation(userId, "userId", "String");
	sellerId = primitiveTypeValidation(sellerId, "sellerId", "String");

	let complaint = await complaintsCollection
		.find({
			userId: userId,
			sellerId: sellerId,
		})
		.toArray();
	if (complaint.length !== 0) {
		throw "error: Complaint with given user and seller already exists";
	}

  const _id = helperMethods.generateObjectID(),
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

	const complaintsCollection = await complaints();
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

const updateComplaintStatus = async(complaintId, updateStatus) => {
  complaintId = helperMethods.checkId(complaintId);
  helperMethods.argumentProvidedValidation(updateStatus, 'updateStatus')
  updateStatus = helperMethods.primitiveTypeValidation(updateStatus, 'updateStatus', 'String')
  const complaintsCollection = await complaints()
  const userComplaintsUpdated = await complaintsCollection.updateOne({
    _id: complaintId
  }, {
    $set: {
      status: updateStatus
    }
  })

  if(userComplaintsUpdated.modifiedCount!=1) throw 'Unable to update complaint'

  return 'success'
  
}

const methods = {
	createComplaint,
	getComplaintsByUserAndSellerId,
  updateComplaintStatus
};

export default methods;
