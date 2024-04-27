import * as helperMethods from './../helper.js';
import { bids, products } from '../configuration/mongoCollections.js';
import { getProducts } from './product.js';
import { ObjectId } from 'mongodb';

const { argumentProvidedValidation, primitiveTypeValidation } = helperMethods;
// below function is a template function, rename it!
const createBid = async (productId, userId, bidAmmount) => {
    productId = helperMethods.checkId(productId);
    userId = helperMethods.checkId(userId);
    argumentProvidedValidation(bidAmmount, "Bid Ammount");
    bidAmmount = primitiveTypeValidation(bidAmmount, "Bid Amount", "Number");


    const searchFilters = { _id: new ObjectId(productId) }

    const product = await getProducts(false, countPerPull, pageNumber, searchFilters, sortFilters, fieldFilters);
    if (!product) {
        throw 'Cannot add bid: product does not exist.'
    }
    const bidToAdd = {
        userID: new ObjectId(userId),
        bidAmmount: bidAmmount
    }
    const bidCollection = await bids();
    let existingBid;
    let addedBid;
    try {
        existingBid = await getBidByProductId(productId);
        addedBid = await bidCollection.findOneAndUpdate(
            { productID: productId },
            { $push: { Bids: bidToAdd } },
            { returnDocument: 'after' }
        );
        if (!addedBid) {
            throw 'Failed to add new bid to product';
        }
        return addedBid;
    }
    catch (error) {
        const newBidDocument = {
            productID: new ObjectId(productId),
            Bids: [
                {
                    userID: new ObjectId(userId),
                    bidAmmount: bidAmmount
                }
            ]
        }
        addedBid = await bidCollection.insertOne(newBidDocument);
        if (!addedBid) {
            throw 'Failed to add new bid document';
        }
        return addedBid;
    }
}
const getBidById = async (bidId) => {
    bidId = helperMethods.checkId(bidId);
    const bidCollection = await bids();
    const bid = await bidCollection.findOne({ _id: new ObjectId(bidId) });
    if (!bid) {
        throw 'Could not find bids';
    }
    return bid;
}
const getBidByProductId = async (productId) => {
    productId = helperMethods.checkId(productId);
    const bidCollection = await bids();
    const bid = await bidCollection.findOne({ productID: new ObjectId(productId) });
    if (!bid) {
        throw 'Could not find bids';
    }
    return bid;
}
const methods = {
    createBid,
    getBidById,
    getBidByProductId
}
export default methods