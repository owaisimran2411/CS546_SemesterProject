import {
    configureDotEnv
} from './../helper.js'

configureDotEnv()

const { MONGO_USERNAME } = process.env
const { MONGO_PASSWORD } = process.env
const { MONGO_APP_NAME } = process.env
const { MONGO_PROJECT_NAME } = process.env
const { MONGO_CONNETION_URL } = process.env


const uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_PROJECT_NAME}.${MONGO_CONNETION_URL}.mongodb.net/?retryWrites=true&w=majority&appName=${MONGO_APP_NAME}`
export const mongoConfig = {
    serverUrl: uri,
    database: MONGO_APP_NAME
};