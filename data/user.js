import { users } from "../configuration/mongoCollections.js";
import * as helperMethods from "./../helper.js";
import { ObjectId } from "mongodb";
// Data function goes here
const { argumentProvidedValidation, primitiveTypeValidation } = helperMethods;
// below function is a template function, rename it!
const userSignUp = async (
	username,
	password,
	securityQuestionOne,
	securityAnswerOne,
	securityQuestionTwo,
	securityAnswerTwo,
	emailAddress,
	phoneNumber,
	gender,
	bio,
	profilePicture
) => {
	const { argumentProvidedValidation, primitiveTypeValidation } = helperMethods;
	// validating all the arguments
	argumentProvidedValidation(username, "Username");
	argumentProvidedValidation(password, "Password");
	argumentProvidedValidation(securityQuestionOne, "Security Question 1");
	argumentProvidedValidation(securityAnswerOne, "Security Answer 1");
	argumentProvidedValidation(securityQuestionTwo, "Security Question 2");
	argumentProvidedValidation(securityAnswerTwo, "Security Answer 2");
	argumentProvidedValidation(emailAddress, "Email Address");
	argumentProvidedValidation(phoneNumber, "Phone Number");
	argumentProvidedValidation(gender, "Gender");
	argumentProvidedValidation(bio, "Bio");
	argumentProvidedValidation(profilePicture, "Profile Picture");

	//validating data types and overriding them after removing spaces
	username = primitiveTypeValidation(username, "Username", "String");
	password = primitiveTypeValidation(password, "Password", "String");
	securityQuestionOne = primitiveTypeValidation(
		securityQuestionOne,
		"Security Question 1",
		"String"
	);
	securityAnswerOne = primitiveTypeValidation(
		securityAnswerOne,
		"Security Answer 1",
		"String"
	);
	securityQuestionTwo = primitiveTypeValidation(
		securityQuestionTwo,
		"Security Question 2",
		"String"
	);
	securityAnswerTwo = primitiveTypeValidation(
		securityAnswerTwo,
		"Security Answer 2",
		"string"
	);
	emailAddress = primitiveTypeValidation(
		emailAddress,
		"Email Address",
		"String"
	);
	phoneNumber = primitiveTypeValidation(phoneNumber, "Phone Number", "Number");
	gender = primitiveTypeValidation(gender, "Gender", "String");
	bio = primitiveTypeValidation(bio, "Bio", "String");
	profilePicture = primitiveTypeValidation(
		profilePicture,
		"Profile Picture",
		"String"
	);

	const newUser = {
		username: username,
		password: password,
		securityQuestionOne: securityQuestionOne,
		securityAnswerOne: securityAnswerOne,
		securityQuestionTwo: securityQuestionTwo,
		securityAnswerTwo: securityAnswerTwo,
		emailAddress: emailAddress,
		phoneNumber: phoneNumber,
		gender: gender,
		bio: bio,
		profilePicture: profilePicture,
	};

	const userCollection = await users();
	// check if username already exists
	const existingUser = await userCollection.findOne({ username: username });
	if (existingUser) {
		throw "Username already exists";
	}

	// check if password already exists 
	const existingEmail = await userCollection.findOne({ emailAddress: emailAddress });
	if (existingEmail) {
		throw "Email already exists";
	}
	const newInsertInformation = await userCollection.insertOne(newUser);
	if (!newInsertInformation.insertedId) throw "Insert failed!";
	return await getUserById(newInsertInformation.insertedId.toString());
};
const getUserById = async (id) => {
	id = helperMethods.checkId(id)
	const userCollection = await users();
	const user = await userCollection.findOne({ _id: new ObjectId(id) });
	if (!user) throw "Error: User not found";
	return user;
};

const getUserByEmail = async (emailAddress) => {
	argumentProvidedValidation(emailAddress, "Email Address");
	emailAddress = primitiveTypeValidation(
		emailAddress,
		"Email Address",
		"String"
	);

	const userCollection = await users();
	const user = await userCollection.findOne({ emailAddress: emailAddress });
	if (!user) throw "Error: User not found";
	return user;
}

const getUserByUsername = async (username) => {
	argumentProvidedValidation(username, "Username");
	username = primitiveTypeValidation(username, "Username", "String");

	const userCollection = await users();
	const user = await userCollection.findOne({ username: username });
	if (!user) throw "Error: User not found";
	return user;
}
const deleteUser = async (id) => {
	id = helperMethods.checkId(id);

	const userCollection = await users();
	const deletedUser = await userCollection.findOneAndDelete(
		{ _id: new ObjectId(id) }
	);
	if (!deletedUser) throw 'Failed to delete user';
	return deletedUser
}
const updateUser = async (id, updateInfo) => {
	id = helperMethods.checkId(id);
	argumentProvidedValidation(updateInfo, 'UpdateInfo');
	updateInfo = primitiveTypeValidation(updateInfo, 'UpdateInfo', 'Object');

	// build the query depending on which values are supplied 
	if (updateInfo.password) {
		updateInfo.password = primitiveTypeValidation(updateInfo.password, "Password", "String");
	}
	if (updateInfo.phoneNumber) {
		updateInfo.phoneNumber = primitiveTypeValidation(updateInfo.phoneNumber, "Phone Number", "Number");
	}
	if (updateInfo.gender) {
		updateInfo.gender = primitiveTypeValidation(updateInfo.gender, "Gender", "String");
	}
	if (updateInfo.bio) {
		updateInfo.bio = primitiveTypeValidation(updateInfo.bio, "Bio", "String");
	}
	const allowedKeys = ['password', 'phoneNumber', 'gender', 'bio'];
	const invalidKeys = Object.keys(updateInfo).filter(key => !allowedKeys.includes(key));
	if (invalidKeys.length > 0) {
		throw 'Invalid Update Keys';
	}
	let query = {};
	for (const key in updateInfo) {
		query[key] = updateInfo[key];
	}
	const userCollection = await users();
	const updatedUser = await userCollection.findOneAndUpdate(
		{ _id: new ObjectId(id) },
		{ $set: query },
		{ returnDocument: 'after' }
	);
	if (!updatedUser) throw 'Failed to update user';
	return updatedUser;

}
const methods = {
	userSignUp,
	getUserById,
	getUserByEmail,
	getUserByUsername,
	updateUser,
	deleteUser
};
export default methods;
