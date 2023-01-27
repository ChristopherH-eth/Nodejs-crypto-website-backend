import express from "express"
import cors from "cors"
import cookieSession from "cookie-session"
import cookieParser from "cookie-parser"
import router from "./routes/crypto-route.js"
import Logger from "./utils/logger.js"

/**
 * @file server.js
 * @author 0xChristopher
 * @brief This file handles the default route creation and server object instantiation.
 */

const app = express()                                   // Express object
const port = 8000                                       // Port to listen on

// Define cors options
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
app.use(express.json())

// Define cookie settings
app.set("trust proxy", 1)

app.use(cookieParser())
app.use(cookieSession({
    name: "session",
    keys: ["key1", "key2"],
    maxAge: 24 * 60 * 60 * 1000                         // 24 hour session expiration
}))

// Define default routes
app.use("/api/v1", router)
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