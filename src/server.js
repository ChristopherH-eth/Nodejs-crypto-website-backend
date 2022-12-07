import express from "express"
import cors from "cors"
import crypto from "./api/crypto-route.js"

/**
 * @file server.js
 * @author 0xChristopher
 * @brief 
 */

const app = express()                   // Express object

app.use(cors())
app.use(express.json())

// Define default routes
app.use("/api/v1/crypto", crypto)
app.use("*", (req, res) => res.status(404).json({error: "Not found"}))

export default app