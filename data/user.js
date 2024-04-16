import { users } from "../configuration/mongoCollections.js";
import * as helperMethods from "./../helper.js";
import { ObjectId } from "mongodb";
// Data function goes here

// below function is a template function, rename it!
const userSignUp = async (
  userName,
  password,
  securityQuestion1,
  securityAnswer1,
  securityQuestion2,
  securityAnswer2,
  emailAddress,
  phoneNumber,
  gender,
  bio,
  profilePicture
) => {
  const { argumentProvidedValidation, primitiveTypeValidation } = helperMethods;
  // validating all the arguments
  argumentProvidedValidation(userName, "Username");
  argumentProvidedValidation(password, "Password");
  argumentProvidedValidation(securityQuestion1, "Security Question 1");
  argumentProvidedValidation(securityAnswer1, "Security Answer 1");
  argumentProvidedValidation(securityQuestion2, "Security Question 2");
  argumentProvidedValidation(securityAnswer2, "Security Answer 2");
  argumentProvidedValidation(emailAddress, "Email Address");
  argumentProvidedValidation(phoneNumber, "Phone Number");
  argumentProvidedValidation(gender, "Gender");
  argumentProvidedValidation(bio, "Bio");
  argumentProvidedValidation(profilePicture, "Profile Picture");

  //validating data types and overriding the
  userName = primitiveTypeValidation(userName, "Username", "String");
  password = primitiveTypeValidation(password, "Password", "String");
  securityQuestion1 = primitiveTypeValidation(
    securityQuestion1,
    "Security Question 1",
    "String"
  );
  securityAnswer1 = primitiveTypeValidation(
    securityAnswer1,
    "Security Answer 1",
    "String"
  );
  securityQuestion2 = primitiveTypeValidation(
    securityQuestion2,
    "Security Question 2",
    "String"
  );
  securityAnswer2 = primitiveTypeValidation(
    securityAnswer2,
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
    userName: userName,
    password: password,
    securityQuestion1: securityQuestion1,
    securityAnswer1: securityAnswer1,
    securityQuestion2: securityQuestion2,
    securityAnswer2: securityAnswer2,
    emailAddress: emailAddress,
    phoneNumber: phoneNumber,
    gender: gender,
    bio: bio,
    profilePicture: profilePicture,
  };

  const userCollection = await users();
  const newInsertInformation = await userCollection.insertOne(newUser);
  if (!newInsertInformation.insertedId) throw "Insert failed!";
  return await this.getUserById(newInsertInformation.insertedId.toString());
};

const getUserById = async (id) => {
  id = validation.checkId(id);
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
