import app from "./server.js"
import mongodb from "mongodb"
import { MONGO_PASSWORD, MONGO_USERNAME } from "./utils/config.js"
import { injectDB } from "./database.js"
import Logger from "./utils/logger.js"

/**
 * @file index.js
 * @author 0xChristopher
 * @brief This file is the entry point for the crypto website backend. It creates the connection to the
 *      MongoDB database and ExpressJS, and begins listening for client requests.
 */

const MongoClient = mongodb.MongoClient                                 // MongoDB client object
const mongoUsername = MONGO_USERNAME                                    // MongoDB username env variable
const mongoPassword = MONGO_PASSWORD                                    // MongoDB password env variable
const uri = `mongodb+srv://${mongoUsername}:${mongoPassword}`
    + `@cluster0.2tcgcpm.mongodb.net/?retryWrites=true&w=majority`      // Database connection URI
const port = 8000                                                       // Port to connect to database on

// Connect to MongoDB
MongoClient.connect(
    uri,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
        useNewUrlParser: true
    })
    .catch((err) => {
        Logger.error(err.stack)
        process.exit(1)
    })
    .then(async (client) => {
        await injectDB(client)

        // Start listening for incoming requests
        app.listen(port, () => {
            Logger.info(`Web server listening on port ${port}`)
        })
    })