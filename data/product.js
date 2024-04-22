import * as helperMethods from "./../helper.js";
import { ObjectId } from "mongodb";
import { products } from "./../configuration/mongoCollections.js";
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
  helperMethods.argumentProvidedValidation(id, 'productID')

  id = helperMethods.primitiveTypeValidation(id, 'productID', 'String')
  id = helperMethods.checkId(id)
  const productCollection = await products();
  const product = await productCollection.findOne({ _id: new ObjectId(id) });
  if (!product) throw "Error: Product not found";
  return product;
};


const getProducts = async (getAllFlag, countPerPull, pageNumber, sortFilters, searchFilters) => {
  // getAllFlag is used if all products needs to be fetched
  // countPerPull is used if all products does not need to be fetched
  // pageNumber is used if all products are not fetched and to skip some products
  // sortFilters to pass in sorting parameters

  helperMethods.argumentProvidedValidation(getAllFlag.toString(), 'getAllFlag')
  getAllFlag = helperMethods.primitiveTypeValidation(getAllFlag, 'getAllFlag', 'Boolean')
  
  let product = undefined
  let sortingFilters = undefined
  let searchFilters = undefined
  
  const productCollection = await products()

  try {
    helperMethods.argumentProvidedValidation(sortFilters, 'sortFilters')
    sortingFilters = helperMethods.primitiveTypeValidation(sortFilters, 'sortFilters', 'Object')
  } catch (e) {
    sortingFilters = {}
  }

  try {
    helperMethods.argumentProvidedValidation(searchFilters, 'searchFilters')
    searchFilters = helperMethods.primitiveTypeValidation(searchFilters, 'searchFilters', 'Object')
  } catch (e) {
    searchFilters = {}
  }
  
  // console.log(countPerPull, '=counterPerPull')
  // console.log(pageNumber, '=pageNumber')
  if(!getAllFlag) {
    
    helperMethods.argumentProvidedValidation(countPerPull, 'countPerPull')
    helperMethods.argumentProvidedValidation(pageNumber, 'pageNumber')

    countPerPull = helperMethods.primitiveTypeValidation(countPerPull, 'countPerPull', 'Number')
    pageNumber = helperMethods.primitiveTypeValidation(pageNumber, 'pageNumber', 'Number')
    
    if(countPerPull<0) {
      countPerPull = 10
    }
    if(pageNumber <= 0) {
      pageNumber=1
      product = await productCollection
                        .find(searchFilters)
                        .limit(countPerPull)
                        .sort(sortFilters)
                        .toArray()
    } else {
      product = await productCollection
                        .find(searchFilters)
                        .skip(pageNumber*countPerPull)
                        .limit(countPerPull)
                        .toArray()
    }
  } else {
    product = await productCollection
                    .find(searchFilters)
                    .sort(sortingFilters)
                    .toArray()
  }

  
  if(product === undefined || product.length === 0) throw 'No Product Found'
  return product
}

const deleteProduct = async (productID) => {
  helperMethods.argumentProvidedValidation(productID, 'productID')
  productID = helperMethods.primitiveTypeValidation(productID, 'productID', 'String')
  productID = helperMethods.checkId(productID)

  const productCollection = await products()
  const productDelete = await productCollection.findOneAndDelete({
    _id: new ObjectId(productID)
  })

  if(!productDelete) throw `Unable to Delete Product with Product ID: ${productID}`
  return {
    productID: productID,
    status: 'success',
    message: 'Product Deletion Successful'
  }
}

const methods = {
  createProduct,
  getProductById,
  getProducts,
  deleteProduct
  // append all other functions implemented to export them as default
};
export default methods;
