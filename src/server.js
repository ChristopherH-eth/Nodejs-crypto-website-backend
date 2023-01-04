import express from "express"
import cors from "cors"
import crypto from "./routes/crypto-route.js"
import mongodb from "mongodb"
import { injectDB } from "./database.js"
import { MONGO_PASSWORD, MONGO_USERNAME } from "./utils/config.js"
import Logger from "./utils/logger.js"

/**
 * @file server.js
 * @author 0xChristopher
 * @brief This file handles the default route creation and server object instantiation.
 */

const MongoClient = mongodb.MongoClient                                 // MongoDB client object
const mongoUsername = MONGO_USERNAME                                    // MongoDB username env variable
const mongoPassword = MONGO_PASSWORD                                    // MongoDB password env variable
const uri = `mongodb+srv://${mongoUsername}:${mongoPassword}`
    + `@cluster0.2tcgcpm.mongodb.net/?retryWrites=true&w=majority`      // Database connection URI
const port = 8000                                                       // Port to connect to database on
const app = express()                                                   // Express object

app.use(cors())
app.use(express.json())

// Define default routes
app.use("/api/v1/crypto", crypto)
app.use("*", (req, res) => res.status(404).json({error: "Not found"}))

function initializeWebServer() {
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
            injectDB(client)

            // Start listening for incoming requests
            app.listen(port, () => {
                Logger.info(`Web server listening on port ${port}`)
                app.emit("serverStarted")
            })
        })
}

export { app, initializeWebServer }