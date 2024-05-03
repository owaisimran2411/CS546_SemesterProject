import * as helperMethods from './../helper.js'
import { metrics } from "../configuration/mongoCollections.js";
import { ObjectId } from "mongodb";
import { metricData } from "./index.js";
// Data function goes here

// below function is a template function, rename it!
const createMetric = async (productSerial, prices) => {
    //assume prices is array of past prices product has been sold for
    const { argumentProvidedValidation, primitiveTypeValidation } = helperMethods;
	argumentProvidedValidation(productSerial, "productSerial");
	argumentProvidedValidation(prices, "prices");
	primitiveTypeValidation(productSerial, "product serial", "String");
	primitiveTypeValidation(prices, "prices", "Array");

	const metricCollection = await metrics();


	let metrics = await metricCollection
		.find({
            productSerial: productSerial,
            prices: prices
		})
		.toArray();
	if (metrics.length !== 0) {
		throw "error: Metric with given serial number and prices already exists";
	}

	const findAveragePrice = helperMethods;
	const _id = helperMethods.generateObjectID();
	const newMetric = {
		_id: _id,
		productSerial: productSerial,
		average_price: findAveragePrice(prices)
	};

	const insertInfo = await metricCollection.insertOne(newMetric);

	if (insertInfo.insertedCount === 0) {
		throw "Error: Could not add metric.";
	}

	return _id;
}

const updateMetric = async (productSerial, newPrice) => {
	const { argumentProvidedValidation, primitiveTypeValidation } = helperMethods;
	argumentProvidedValidation(productSerial, "productSerial");
	primitiveTypeValidation(productSerial, "productSerial", "String");
	argumentProvidedValidation(newPrice, "newPrice");
	primitiveTypeValidation(newPrice, "newPrice", "Number");
	const updatedMetricInfo = { newPrice};
	const metricCollection = await metrics();
	const updateInfo = await metricCollection.updateOne(
		{
			productSerial: productSerial
		},
		{
			$set: updateProductInfo
		}
	);
	console.log(updateInfo);
};

const methods = {
    createMetric,
	updateMetric
    // append all other functions implemented to export them as default
}
export default methods