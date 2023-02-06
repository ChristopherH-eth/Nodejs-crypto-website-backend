import mongodb from "mongodb"
import { MONGO_PASSWORD, MONGO_USERNAME } from "./utils/config.js"
import { startListening } from "./server.js"
import Logger from "./utils/logger.js"

/**
 * @file database.js
 * @author 0xChristopher
 * @brief This file handles the database connection request from index.js. It checks to make sure we don't
 *      already have a connection before attempting to connect to the MongoDB datbase.
 */

const MongoClient = mongodb.MongoClient                                 // MongoDB client object
const mongoUsername = MONGO_USERNAME                                    // MongoDB username env variable
const mongoPassword = MONGO_PASSWORD                                    // MongoDB password env variable
const uri = `mongodb+srv://${mongoUsername}:${mongoPassword}`
    + `@cluster0.2tcgcpm.mongodb.net/?retryWrites=true&w=majority`      // Database connection URI
let database                                                            // Database connection

/**
 * @brief The injectDB() function connects the client to the database.
 * @param conn The client instance
 * @returns Returns if there is already an established database connection
 */
async function injectDB(conn)
{
    // Check if we already have an established connection
    if (database)
        return
    
    // Try to connect to database or else log error
    try
    {
        database = await conn.db("cryptocurrencies")
    }
    catch (e)
    {
        Logger.error(`Unable to establish connection handles in database: ${e}`)
    }
}

/**
 * @brief The connectToDB() function initializes a MongoClient, connects to the database, and once the
 *      database connection is made, it tells the server to start listening for requests.
 */
async function connectToDBAndListen() {
    // Connect to MongoDB
    await MongoClient.connect(
        uri,
        {
            maxPoolSize: 50,
            wtimeoutMS: 2500,
            useNewUrlParser: true
        })
        .then((client) => {
            injectDB(client)
            Logger.info("Database connection open")
        })
        .then(() => {
            // Start listening for requests
            startListening()
        })
        .catch((err) => {
            Logger.error(err.stack)
            process.exit(1)
        })
}

export { connectToDBAndListen, database }