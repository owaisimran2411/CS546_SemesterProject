import * as helperMethods from './../helper.js'
import {users} from './../configuration/mongoCollections.js'

// Data function goes here

// below function is a template function, rename it!
const dataFunction1 = async () => {
    const userCollection = await users();
    return await userCollection.find({}).toArray();
}

const methods = {
    dataFunction1,
    // append all other functions implemented to export them as default
}
export default methods