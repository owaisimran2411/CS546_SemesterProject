import * as helperMethods from "./../helper.js";
import { ObjectId } from "mongodb";
import { products } from "../configuration/mongoCollections.js";
// Data function goes here

// below function is a template function, rename it!
const createProduct = async (
  productName,
  productDescription,
  productCondition,
  serialNumber,
  price,
  supportedConsoles,
  productThumbnail,
  otherImages,
  listingActive,
  productOwnerId
) => {
  const { argumentProvidedValidation, primitiveTypeValidation } = helperMethods;
  // validating all the arguments
  argumentProvidedValidation(productName, "Product name");
  argumentProvidedValidation(productDescription, "Product description");
  argumentProvidedValidation(productCondition, "Product condition");
  argumentProvidedValidation(serialNumber, "Product serial number");
  argumentProvidedValidation(price, "price");
  argumentProvidedValidation(supportedConsoles, "Supported Consoles");
  argumentProvidedValidation(productThumbnail, "Product Thumbnail");
  argumentProvidedValidation(otherImages, "Product other images");
  argumentProvidedValidation(listingActive, "Product listing status");
  argumentProvidedValidation(productOwnerId, "Owner ID");

  //validating data types and overriding them after removing spaces
  productName = primitiveTypeValidation(productName, "Product name", "String");
  productDescription = primitiveTypeValidation(
    productDescription,
    "Product description",
    "String"
  );
  productCondition = primitiveTypeValidation(
    productCondition,
    "Product condition",
    "String"
  );
  serialNumber = primitiveTypeValidation(
    serialNumber,
    "Product serial number",
    "String"
  );
  price = primitiveTypeValidation(price, "price", "Number");
  supportedConsoles = primitiveTypeValidation(
    supportedConsoles,
    "Supported consoles",
    "Array"
  );
  productThumbnail = primitiveTypeValidation(
    productThumbnail,
    "Product thumbnail",
    "String"
  );
  otherImages = primitiveTypeValidation(
    otherImages,
    "other images",
    "Array"
  );
  listingActive = primitiveTypeValidation(
    listingActive,
    "Product listing status",
    "Boolean"
  );
  productOwnerId = helperMethods.checkId(productOwnerId);

  const newProduct = {
    productName : productName,
    productDescription : productDescription,
    productCondition : productCondition,
    serialNumber :serialNumber,
    supportedConsoles : supportedConsoles,
    productThumbnail : productThumbnail,
    otherImages : otherImages,
    listingActive : listingActive,
    productOwnerId : productOwnerId,
  }

  const productCollection = await products();
  const newInsertInformation = await productCollection.insertOne(newProduct);
  if (!newInsertInformation.insertedId) throw "Insert failed!";
  return await getProductById(newInsertInformation.insertedId.toString());

};

const getProductById = async (id) => {
  id = helperMethods.checkId(id)
  const userCollection = await products();
  const user = await userCollection.findOne({ _id: new ObjectId(id) });
  if (!user) throw "Error: User not found";
  return user;
};

const methods = {
  createProduct,
  getProductById
  // append all other functions implemented to export them as default
};
export default methods;
