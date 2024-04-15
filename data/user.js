<<<<<<< HEAD
import * as helperMethods from './../helper.js'
import {users} from './../configuration/mongoCollections.js'
=======
>>>>>>> master

import * as helperMethods from "./../helper.js";
import {ObjectId} from 'mongodb';
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
    // object to check all the fields
  const fieldToCheck = [
    { name: "Username", value: userName },
    { name: "Password", value: password },
    { name: "Security Question 1", value: securityQuestion1 },
    { name: "Security Answer 1", value: securityAnswer1 },
    { name: "Security Question 2", value: securityQuestion2 },
    { name: "Security Answer 2", value: securityAnswer2 },
    { name: "Email Address", value: emailAddress },
    { name: "Phone Number", value: phoneNumber },
    { name: "Gender", value: gender },
    { name: "Bio", value: bio },
    { name: "Profile Picture", value: profilePicture },
  ];
  // checking all the fields using fieldToCheck object
  for (let i of fieldToCheck) {
    helperMethods.checkString(i.value, i.name);
  }

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
    const user = await userCollection.findOne({_id: new ObjectId(id)});
    if (!user) throw 'Error: User not found';
    return user;
  }
const methods = {
  userSignUp,
  getUserById
}
export default methods
