import { users } from "../configuration/mongoCollections.js";
import * as helperMethods from "./../helper.js";
import { ObjectId } from "mongodb";
// Data function goes here

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
const methods = {
  userSignUp,
  getUserById,
};
export default methods;
