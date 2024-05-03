import dotenv from "dotenv";
import { ObjectId } from "mongodb";
import xss from "xss";

import multer from "multer";
import multerS3 from "multer-s3";
import {
	S3Client,
	PutObjectCommand,
	CopyObjectCommand,
	DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const configureDotEnv = () => {
	// function definition goes here
	dotenv.config();
};

const argumentProvidedValidation = (arg, argName) => {
	// console.log(`Arg: ${argName}, Value: ${arg}`)
	if (!arg) {
		throw `${argName || "Argument"} not provided`;
	}
};
const primitiveTypeValidation = (arg, argName, primitiveType) => {
	switch (primitiveType) {
		case "String":
			if (typeof arg !== "string" || arg.trim().length === 0) {
				throw `${argName || "Argument"} is not a String or an empty string`;
			}
			arg = arg.trim();
			arg = xss(arg);
			break;
		case "Number":
			if (typeof arg !== "number" || isNaN(arg)) {
				throw `${argName || "Argument"} is not a Number`;
			}
			break;
		case "Boolean":
			if (typeof arg !== "boolean") {
				throw `${argName || "Argument"} is not a Boolean`;
			}
			break;
		case "Array":
			if (!Array.isArray(arg) || arg.length === 0) {
				throw `${argName || "Argument"} is not an Array or is an empty array`;
			}
			break;
		case "Object":
			if (typeof arg !== "object" || Object.keys(arg).length === 0) {
				throw `${argName || "Argument"} is not an object or is an empty object`;
			}
			const sanitizedObj = {};
			for (const key in arg) {
				if (Object.prototype.hasOwnProperty.call(arg, key)) {
					sanitizedObj[key] =
						typeof arg[key] === "string" ? xss(arg[key]) : arg[key];
				}
			}
			return sanitizedObj;
	}

	return arg;
};

const checkIsValidPassword = (password) => {
	if (/\s/.test(password)) {
		throw "Error : Password should not contain spaces";
	}
	const specialCharacters = "!@#$%^&*()-_+=<>?/\\";
	if (password.length < 8) {
		throw "Error : Password should be at least 8 characters long.";
	}

	let isUppercase = false;
	let isLowercase = false;
	let isNumber = false;
	let isSpecialCharacter = false;

	for (let char of password) {
		if (char >= "A" && char <= "Z") {
			isUppercase = true;
		}
		if (char >= "a" && char <= "z") {
			isLowercase = true;
		}
		if (!isNaN(char)) {
			isNumber = true;
		}
		if (specialCharacters.includes(char)) {
			isSpecialCharacter = true;
		}
	}

	if (!isUppercase) {
		throw "Error : Password should contain at least one uppercase character.";
	}

	if (!isUppercase) {
		throw "Error : Password should contain at least one uppercase character.";
	}

	if (!isLowercase) {
		throw "Error : Password should contain at least one lowercase character.";
	}

	if (!isNumber) {
		throw "Error : Password should contain at least one number.";
	}

	if (!isSpecialCharacter) {
		throw "Error : Password should contain at least one special character.";
	}
};

const checkId = (id) => {
	if (!id) throw "Error: You must provide an id to search for";
	if (typeof id !== "string") throw "Error: id must be a string";
	id = id.trim();
	if (id.length === 0)
		throw "Error: id cannot be an empty string or just spaces";
	if (!ObjectId.isValid(id)) throw "Error: invalid object ID";
	return id;
};

const createS3Client = (accessKey, secretKey, region) => {
	return new S3Client({
		region: region,
		credentials: {
			accessKeyId: accessKey,
			secretAccessKey: secretKey,
		},
	});
};

const createMulterObject = (s3Client, bucketName, fileType, otherFiles) => {
	if (!otherFiles) {
		return multer({
			storage: multerS3({
				s3: s3Client,
				bucket: bucketName,
				acl: "public-read",
				key: (req, file, cb) => {
					cb(
						null,
						`${generateObjectID()}-${fileType}.${
							file.originalname.split(".")[1]
						}`
					);
				},
			}),
		});
	} else {
		return multer({
			storage: multerS3({
				s3: s3Client,
				bucket: bucketName,
				acl: "public-read",
				key: (req, file, cb) => {
					cb(
						null,
						`tempLocation/${file.originalname.split(".")[0]}.${
							file.originalname.split(".")[1]
						}`
					);
				},
			}),
		});
	}
};

const generateObjectID = () => {
	return new ObjectId();
};
const checkBidAmount = (bid) => {
	if (bid < 0 || bid >= 999.99) {
		throw new "Bid amount must be between 0 and 999.99"();
	}

	return Math.round(parseFloat(bid) * 100) / 100; // round to 2 decimal places
};

const moveFileFromTempToDestinationLocation = async (
	s3Client,
	sourceObject,
	productID
) => {
	const copycommand = new CopyObjectCommand({
		CopySource: `${sourceObject.bucket}/${sourceObject.key}`,
		Bucket: sourceObject.bucket,
		Key: `${productID}/${sourceObject.originalname}`,
	});
	try {
		const response = await s3Client.send(copycommand);
		const deletecommand = new DeleteObjectCommand({
			Bucket: sourceObject.bucket,
			Key: `${sourceObject.key}`,
		});

		try {
			const response = await s3Client.send(deletecommand);
			return `https://cs546-project-s3.s3.us-east-2.amazonaws.com/${productID}/${sourceObject.originalname}`;
		} catch (e) {
			throw e;
		}
	} catch (err) {
		throw err;
	}
};

const findAveragePrice = (prices) => {
	let sum = 0;
	for (price of prices) {
		sum += price;
	}
	return sum / prices.length;
};

export {
	checkId,
	checkIsValidPassword,
	configureDotEnv,
	primitiveTypeValidation,
	argumentProvidedValidation,
	createS3Client,
	createMulterObject,
	generateObjectID,
	checkBidAmount,
	moveFileFromTempToDestinationLocation,
	// method names go here
};
