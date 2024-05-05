import { users } from "../configuration/mongoCollections.js";
import * as helperMethods from "./../helper.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
// Data function goes here
const { argumentProvidedValidation, primitiveTypeValidation } = helperMethods;
// below function is a template function, rename it!
const userSignUp = async (
	id,
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
	argumentProvidedValidation(securityQuestionOne, "Security Question one");
	argumentProvidedValidation(securityAnswerOne, "Security Answer one");
	argumentProvidedValidation(securityQuestionTwo, "Security Question two");
	argumentProvidedValidation(securityAnswerTwo, "Security Answer two");
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
	//check for valid password
	helperMethods.checkIsValidPassword(password);
	// hashing the password
	password = await bcrypt.hash(password, 16);

	username = username.toLowerCase();
	emailAddress = emailAddress.toLowerCase();
	securityAnswerOne = securityAnswerOne.toLowerCase();
	securityAnswerTwo = securityAnswerTwo.toLowerCase();
	securityQuestionOne = securityQuestionOne.toLowerCase();
	securityQuestionTwo = securityQuestionTwo.toLowerCase();
	const newUser = {
		_id: id,
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
		userActive: true,
	};

	const userCollection = await users();
	// check if username already exists
	const existingUser = await userCollection.findOne({ username: username });
	if (existingUser) {
		throw "Username already exists";
	}

	// check if password already exists
	const existingEmail = await userCollection.findOne({
		emailAddress: emailAddress,
	});
	if (existingEmail) {
		throw "Email already exists";
	}
	const newInsertInformation = await userCollection.insertOne(newUser);
	if (!newInsertInformation.insertedId) throw "Insert failed!";
	return await getUserById(newInsertInformation.insertedId.toString());
};
const getUserById = async (id) => {
	id = helperMethods.checkId(id);
	const userCollection = await users();
	const user = await userCollection.findOne({ _id: id });
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
	emailAddress = emailAddress.toLowerCase();
	const userCollection = await users();
	const user = await userCollection.findOne({ emailAddress: emailAddress });
	if (!user) throw "Error: User not found";
	return user;
};

const getUserByUsername = async (username) => {
	argumentProvidedValidation(username, "Username");
	username = primitiveTypeValidation(username, "Username", "String");

	username = username.toLowerCase();

	const userCollection = await users();
	const user = await userCollection.findOne({ username: username });
	if (!user) throw "Error: User not found";
	return user;
};
const deleteUser = async (id) => {
	id = helperMethods.checkId(id);

	const userCollection = await users();
	const deletedUser = await userCollection.findOneAndDelete({
		_id: id,
	});
	if (!deletedUser) throw "Failed to delete user";
	return deletedUser;
};
const updateUser = async (id, updateInfo) => {
	console.log(updateInfo);
	id = helperMethods.checkId(id);
	argumentProvidedValidation(updateInfo, "UpdateInfo");
	updateInfo = primitiveTypeValidation(updateInfo, "UpdateInfo", "Object");

	// build the query depending on which values are supplied
	if (updateInfo.password) {
		updateInfo.password = primitiveTypeValidation(
			updateInfo.password,
			"Password",
			"String"
		);
		helperMethods.checkIsValidPassword(updateInfo.password);
		console.log("password check pass");

		// hashing the password
		updateInfo.password = await bcrypt.hash(updateInfo.password, 16);
	}
	if (updateInfo.phoneNumber) {
		updateInfo.phoneNumber = primitiveTypeValidation(
			updateInfo.phoneNumber,
			"Phone Number",
			"Number"
		);
	}
	if (updateInfo.gender) {
		updateInfo.gender = primitiveTypeValidation(
			updateInfo.gender,
			"Gender",
			"String"
		);
		updateInfo.gender = updateInfo.gender.toLowerCase();
	}
	if (updateInfo.bio) {
		updateInfo.bio = primitiveTypeValidation(updateInfo.bio, "Bio", "String");
	}

	if (updateInfo.userActive) {
		updateInfo.userActive = primitiveTypeValidation(
			updateInfo.userActive,
			"userActive",
			"Boolean"
		);
	}
	const allowedKeys = [
		"password",
		"phoneNumber",
		"gender",
		"bio",
		"userActive",
	];
	const invalidKeys = Object.keys(updateInfo).filter(
		(key) => !allowedKeys.includes(key)
	);
	if (invalidKeys.length > 0) {
		throw "Invalid Update Keys";
	}
	let query = {};
	console.log(query);
	for (const key in updateInfo) {
		query[key] = updateInfo[key];
	}
	// console.log(query);
	const userCollection = await users();
	const updatedUser = await userCollection.findOneAndUpdate(
		{ _id: id },
		{ $set: query },
		{ returnDocument: "after" }
	);
	if (!updatedUser) throw "Failed to update user";
	return updatedUser;
};

const userLogin = async (username, password) => {
	argumentProvidedValidation(username, "Username");
	argumentProvidedValidation(password, "Password");
	username = primitiveTypeValidation(username, "Username", "String");
	password = primitiveTypeValidation(password, "Password", "String");
	helperMethods.checkIsValidPassword(password);
	const userCollection = await users();

	const user = await userCollection.findOne({ username });

	const isPasswordValid = await bcrypt.compare(password, user.password);

	if (!isPasswordValid) {
		throw "Password is invalid.";
	}
	return {
		username: user.username,
		id: user._id,
	};
};

const getUser = async (searchParam) => {
	const search = typeof searchParam === "object" ? searchParam : {};

	const allowedKeys = ["username", "emailAddress", "phoneNumber", "_id"];
	if (search != {}) {
		const invalidKeys = Object.keys(search).filter(
			(key) => !allowedKeys.includes(key)
		);
		if (invalidKeys.length > 0) {
			throw "Invalid Update Keys";
		}
	}

	const userCollection = await users();
	const data = await userCollection
		.find(searchParam)
		.project({
			username: 1,
			emailAddress: 1,
			_id: 1,
			phoneNumber: 1,
			userActive: 1,
		})
		.toArray();
	return data;
};

const methods = {
	userSignUp,
	userLogin,
	getUserById,
	getUserByEmail,
	getUserByUsername,
	updateUser,
	deleteUser,
	getUser,
};
export default methods;
