import dotenv from 'dotenv'
import { ObjectId } from 'mongodb';
import xss from 'xss';

import multer from 'multer';
import multerS3 from 'multer-s3'
import {
  S3Client, PutObjectCommand,
} from '@aws-sdk/client-s3'





const configureDotEnv = () => {
  // function definition goes here
  dotenv.config()
}


const argumentProvidedValidation = (arg, argName) => {
  // console.log(`Arg: ${argName}, Value: ${arg}`)
  if (!arg) {
    throw `${argName || "Argument"} not provided`
  }
}
const primitiveTypeValidation = (arg, argName, primitiveType) => {
  switch (primitiveType) {
    case "String":
      if (typeof arg !== "string" || arg.trim().length === 0) {
        throw `${argName || "Argument"} is not a String or an empty string`
      }
      arg = arg.trim()
      arg = xss(arg)
      break
    case "Number":
      if (typeof arg !== "number" || isNaN(arg)) {
        throw `${argName || "Argument"} is not a Number`
      }
      break
    case "Boolean":
      if (typeof arg !== "boolean") {
        throw `${argName || "Argument"} is not a Boolean`
      }
      break
    case "Array":
      if (!Array.isArray(arg) || arg.length === 0) {
        throw `${argName || "Argument"} is not an Array or is an empty array`
      }
      break
    case "Object":
      if (typeof (arg) !== 'object' || Object.keys(arg).length === 0) {
        throw `${argName || 'Argument'} is not an object or is an empty object`;
      }
      const sanitizedObj = {};
      for (const key in arg) {
        if (Object.prototype.hasOwnProperty.call(arg, key)) {
          sanitizedObj[key] = xss(arg[key]);
        }
      }
      return sanitizedObj;
  }
  
  return arg
}


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
        secretAccessKey: secretKey
    }

  })
}

const createMulterObject = (s3Client, bucketName, fileType) => {
  return multer({
    storage: multerS3({
      s3: s3Client,
      bucket: bucketName,
      acl: 'public-read',
      key: (req, file, cb) => {
        cb(null, `${generateObjectID()}-${fileType}.${file.originalname.split('.')[1]}`)
      }
  })
  })
}

const generateObjectID = () => {
  return new ObjectId()
}


export {
  checkId,
  configureDotEnv,
  primitiveTypeValidation,
  argumentProvidedValidation,
  createS3Client,
  createMulterObject,
  generateObjectID
  // method names go here
};
