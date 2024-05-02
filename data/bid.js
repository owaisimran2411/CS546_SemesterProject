import * as helperMethods from './../helper.js';
import { bids } from '../configuration/mongoCollections.js';
import { ObjectId } from 'mongodb';
import { productData } from './index.js';

const { argumentProvidedValidation, primitiveTypeValidation } = helperMethods;
// below function is a template function, rename it!
const createBid = async (productId, userId, bidAmount) => {
    productId = helperMethods.checkId(productId);
    userId = helperMethods.checkId(userId);
    argumentProvidedValidation(bidAmount, "Bid Ammount");
    bidAmount = primitiveTypeValidation(bidAmount, "Bid Amount", "Number");
    bidAmount = helperMethods.checkBidAmount(bidAmount);

    const product = await productData.getProductById(productId);
    if (!product) {
        throw 'Cannot add bid: product does not exist.'
    }
    const bidToAdd = {
        userID: new ObjectId(userId),
        bidAmount: bidAmount
    }
    let addedBid;
    const bidCollection = await bids();

    const existingBid = await bidCollection.findOne({ productID: new ObjectId(productId) });
    if (!existingBid) {// if the product does not have any bids, a new document must be made
        const newBidDocument = {
            productID: new ObjectId(productId),
            Bids: [
                {
                    userID: new ObjectId(userId),
                    bidAmount: bidAmount
                }
            ]
        };
        addedBid = await bidCollection.insertOne(newBidDocument);
        if (!addedBid.acknowledged) {
            throw 'Failed to add new bid document.'
        }
    }
    else {// if bids exist, just add them to the array
        const existingUserBid = await bidCollection.findOne({
            productID: new ObjectId(productId),
            'Bids.userID': new ObjectId(userId)
        });
        if (existingUserBid) {
            throw 'User already has a bid on this product';
        }


        addedBid = await bidCollection.findOneAndUpdate(
            { productID: new ObjectId(productId) },
            { $push: { Bids: bidToAdd } }
        );
        if (!addedBid) {
            throw 'Failed to add bid to existing document';
        }
    }
    const fullBidObject = await getBidByProductId(productId);
    return fullBidObject;
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

const getAllBidsByProductId = async (productId) => {
    productId = helperMethods.checkId(productId);
    const bidCollection = await bids();
    let bidList = await bidCollection.find({}).toArray();

    bidList = bidList.filter((bid) => bid.productID.equals(productId))
    if (!bidList) {
        throw 'Could not find all bids';
    }
    return bidList;
}

const getUserBidForProduct = async (productId, userId) => {
    productId = helperMethods.checkId(productId);
    userId = helperMethods.checkId(userId);

    const bidCollection = await bids();
    const userBid = await bidCollection.findOne(
        { "productID": new ObjectId(productId) },
        { projection: { _id: 0, Bids: 1 } }
    );
    if (!userBid) {
        throw 'Failed to fetch bid for user';
    }
    let specificBid = userBid.Bids.find((bid) => bid.userID.toString() === userId.toString());
    if (!specificBid) {
        throw 'Bid not found for user';
    }

    return specificBid;
}
/* const getUserBids = async (userId) => {
    userId = helperMethods.checkId(userId);

    const bidCollection = await bids();
    const userBids = await bidCollection.find(
        { "Bids.userID": new ObjectId(userId) },
        { projection: { _id: 0, productID: 1, Bids: { $elemMatch: { userID: new ObjectId(userId) } } } }
    ).toArray();

    return userBids.map(bid => ({
        productID: bid.productID,
        bidAmount: bid.Bids[0].bidAmount
    }));
} */
const getUserBids = async (userId, getAllFlag, counter) => {
    userId = helperMethods.checkId(userId);

    const bidCollection = await bids();
    let query = { "Bids.userID": new ObjectId(userId) };

    if (!getAllFlag && typeof counter === 'number') {
        query = { "Bids.userID": new ObjectId(userId) };
    }

    const projection = {
        _id: 0,
        productID: 1,
        Bids: {
            $elemMatch: { userID: new ObjectId(userId) }
        }
    };

    let userBids;

    if (getAllFlag) {
        userBids = await bidCollection.find(query, { projection }).toArray();
    } else {
        userBids = await bidCollection.find(query, { projection }).limit(counter).toArray();
    }

    return userBids.map(bid => ({
        productID: bid.productID,
        bidAmount: bid.Bids[0].bidAmount
    }));
}
const updateBidAmmount = async (productId, userId, bidAmount) => {
    productId = helperMethods.checkId(productId);
    userId = helperMethods.checkId(userId);
    argumentProvidedValidation(bidAmount, "Bid Ammount");
    bidAmount = primitiveTypeValidation(bidAmount, "Bid Amount", "Number");
    bidAmount = helperMethods.checkBidAmount(bidAmount);

    const bidCollection = await bids();
    const updatedBid = await bidCollection.findOneAndUpdate(
        {
            productID: new ObjectId(productId),
            'Bids.userID': new ObjectId(userId)
        },
        { $set: { 'Bids.$.bidAmount': bidAmount } },
        { returnDocument: 'after' }
    );
    if (!updatedBid) {
        throw 'Failed to update bid amount';
    }
    return updatedBid;
}
const deleteBidDocumentById = async (productId, bidId) => { // do not use both params. if using one, the other should be undefined
    let query = {}
    if (productId) {
        productId = helperMethods.checkId(productId);
        query['productID'] = new ObjectId(productId);
    }
    else if (bidId) {
        bidId = helperMethods.checkId(bidId);
        query['_id'] = new ObjectId(bidId);
    }
    else {
        throw 'Product or bid id must be supplied';
    }

    const bidCollection = await bids();
    const deletedBid = await bidCollection.deleteOne(query);
    if (!deletedBid) {
        throw 'Failed to delete bid';
    }
    return deletedBid;
}
const deleteUserBid = async (productId, userId) => {
    productId = helperMethods.checkId(productId);
    userId = helperMethods.checkId(userId);

    const bidCollection = await bids();
    const deletedBid = await bidCollection.findOneAndUpdate(
        { productID: new ObjectId(productId) },
        { $pull: { Bids: { userID: new ObjectId(userId) } } },
        { returnDocument: 'after' }
    );
    if (!deletedBid) {
        throw 'Failed to remove user bid';
    }
    return deletedBid;
}
const methods = {
    createBid,
    getBidById,
    getBidByProductId,
    updateBidAmmount,
    deleteBidDocumentById,
    deleteUserBid,
    getUserBidForProduct,
    getUserBids
}
export default methods;