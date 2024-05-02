import * as helperMethods from './../helper.js';
import { complaints } from '../configuration/mongoCollections.js';
import { ObjectId } from 'mongodb';
import { userData } from './index.js';

const createComplaint = async (
    userId, 
    sellerId, 
    complaintText
) => {
    const { argumentProvidedValidation, primitiveTypeValidation } = helperMethods;
    argumentProvidedValidation(userId, "userId");
    argumentProvidedValidation(sellerId, "sellerId");
    userId = primitiveTypeValidation(
        userId,
        "userId",
        "String"
      );
    sellerId = primitiveTypeValidation(
        sellerId,
        "sellerId",
        "String"
      );

      let complaint = await complaintsCollection.find({
        userId: ObjectId(userId),
        sellerId: ObjectId(sellerId)
      }).toArray();
      if (complaint.length !== 0) {
        throw "error: Complaint with given user and seller already exists";
      };

      const newComplaint = {
        userId: ObjectId(userId),
        sellerId: ObjectId(sellerId),
        complaintText: complaintText,
        status: "Pending"
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

    return insertInfo.insertedId;

};

const getComplaintsByUserAndSellerId = async (userId, sellerId) => {
    const complaintsCollection = await complaints();
    const userComplaints = await complaintsCollection.find({
      userId: ObjectId(userId),
      sellerId: ObjectId(sellerId)
    }).toArray();
    return userComplaints;
};

const methods = {
  createComplaint,
  getComplaintsByUserAndSellerId
};

export default methods;
