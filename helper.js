import dotenv from 'dotenv'
import {ObjectId} from 'mongodb';
import xss from 'xss';

const configureDotEnv = () => {
    // function definition goes here
    dotenv.config()
}


const argumentProvidedValidation = (arg, argName) => {
  // console.log(`Arg: ${argName}, Value: ${arg}`)
  if(!arg) {
      throw `${argName || "Argument"} not provided`
  }
}
const primitiveTypeValidation = (arg, argName, primitiveType) => {
  switch(primitiveType) {
      case "String":
          if (typeof arg !== "string" || arg.trim().length === 0) {
              throw `${argName || "Argument"} is not a String or an empty string`
          }
          arg = arg.trim()
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
  }
  arg = xss(arg)
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

export {
  checkString,
  checkId,
  configureDotEnv,
  primitiveTypeValidation,
  argumentProvidedValidation
  // method names go here
};
