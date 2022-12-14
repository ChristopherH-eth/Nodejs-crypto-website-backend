import express from "express"
import cors from "cors"
import crypto from "./routes/crypto-route.js"
import Logger from "./utils/logger.js"

/**
 * @file server.js
 * @author 0xChristopher
 * @brief This file handles the default route creation and server object instantiation.
 */

const app = express()                                   // Express object
const port = 8000                                       // Port to listen on

app.use(cors())
app.use(express.json())

// Define default routes
app.use("/api/v1", crypto)
app.use("*", (req, res) => res.status(404).json({error: "Not found"}))

/**
 * @brief The startListening() function tells the ExpressJS instance to start listening on a given port.
 */
function startListening() 
{
    try
    {
        // Start listening for incoming requests
        app.listen(port, () => {
            Logger.info(`Web server listening on port ${port}`)
            app.emit("serverStarted")
        })
    }
    catch (e)
    {
        Logger.error(`Unable to start listener on port ${port}: ${e}`)
    }
}

export { app, startListening }