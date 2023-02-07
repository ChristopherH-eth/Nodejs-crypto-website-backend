import { startListening } from "./server.js"

/**
 * @file index.js
 * @author 0xChristopher
 * @brief This file is the entry point for the crypto website backend. It creates the connection to the
 *      MongoDB database and ExpressJS, and begins listening for client requests.
 */

// Initialize the connection to the database and start listening for requests
startListening()