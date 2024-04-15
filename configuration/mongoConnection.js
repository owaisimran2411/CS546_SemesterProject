import {MongoClient, ServerApiVersion} from 'mongodb';
import {mongoConfig} from './settings.js';

let _connection = undefined;
let _db = undefined

const dbConnection = async () => {
    const client = new MongoClient(mongoConfig.serverUrl, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      })
    if (!_connection) {
        console.log("Connection establishing")
        _connection = await client.connect()
        await _connection.db("admin").command({ ping: 1 });
        _db = _connection.db(mongoConfig.database)
    }

    return _db;
};
const closeConnection = async () => {
  await _connection.close();
};

export {dbConnection, closeConnection};