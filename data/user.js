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
	const existingPassword = await userCollection.findOne({ password: password });
	if (existingPassword) {
		throw "Password already exists";
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
const updateUsername = async (id, username) => {
	id = helperMethods.checkId(id);
	argumentProvidedValidation(username, "Username");
	username = primitiveTypeValidation(username, "Username", "String");

	const userCollection = await users();
	const updatedUser = await userCollection.findOneAndUpdate(
		{ _id: new ObjectId(id) },
		{ $set: { username: username } },
		{ returnDocument: 'after' }
	);
	if (!updatedUser) throw 'Failed to update username';
	return updatedUser;
}
const updatePassword = async (id, password) => {
	id = helperMethods.checkId(id);
	argumentProvidedValidation(password, "Password");
	password = primitiveTypeValidation(password, "Password", "String");

	const userCollection = await users();
	const updatedUser = await userCollection.findOneAndUpdate(
		{ _id: new ObjectId(id) },
		{ $set: { password: password } },
		{ returnDocument: 'after' }
	);
	if (!updatedUser) throw 'Failed to update password';
	return updatedUser;
}
const updateEmailAddress = async (id, emailAddress) => {
	id = helperMethods.checkId(id);
	argumentProvidedValidation(emailAddress, "Email Address");
	emailAddress = primitiveTypeValidation(
		emailAddress,
		"Email Address",
		"String"
	);
	const userCollection = await users();
	const updatedUser = await userCollection.findOneAndUpdate(
		{ _id: new ObjectId(id) },
		{ $set: { emailAddress: emailAddress } },
		{ returnDocument: 'after' }
	);
	if (!updatedUser) throw 'Failed to update email';
	return updatedUser;
}
const updatePhoneNumber = async (id, phoneNumber) => {
	id = helperMethods.checkId(id);
	argumentProvidedValidation(phoneNumber, "Phone Number");
	phoneNumber = primitiveTypeValidation(phoneNumber, "Phone Number", "Number");

	const userCollection = await users();
	const updatedUser = await userCollection.findOneAndUpdate(
		{ _id: new ObjectId(id) },
		{ $set: { phoneNumber: phoneNumber } },
		{ returnDocument: 'after' }
	);
	if (!updatedUser) throw 'Failed to update phone number';
	return updatedUser;
}
const updateGender = async (id, gender) => {
	id = helperMethods.checkId(id);
	argumentProvidedValidation(gender, "Gender");
	gender = primitiveTypeValidation(gender, "Gender", "String");

	const userCollection = await users();
	const updatedUser = await userCollection.findOneAndUpdate(
		{ _id: new ObjectId(id) },
		{ $set: { gender: gender } },
		{ returnDocument: 'after' }
	);
	if (!updatedUser) throw 'Failed to update gender';
	return updatedUser;
}
const updateBio = async (id, bio) => {
	id = helperMethods.checkId(id);
	argumentProvidedValidation(bio, "Bio");
	bio = primitiveTypeValidation(bio, "Bio", "String");

	const userCollection = await users();
	const updatedUser = await userCollection.findOneAndUpdate(
		{ _id: new ObjectId(id) },
		{ $set: { bio: bio } },
		{ returnDocument: 'after' }
	);
	if (!updatedUser) throw 'Failed to update bio';
	return updatedUser;
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
const methods = {
	userSignUp,
	getUserById,
	getUserByEmail,
	getUserByUsername,
	updateEmailAddress,
	updatePassword,
	updateUsername,
	updatePhoneNumber,
	updateGender,
	updateBio,
	deleteUser
};
export default methods;
