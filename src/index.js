import { initializeWebServer } from "./server.js"

/**
 * @file index.js
 * @author 0xChristopher
 * @brief This file is the entry point for the crypto website backend. It creates the connection to the
 *      MongoDB database and ExpressJS, and begins listening for client requests through the 
 *      initializeWebServer() function.
 */

// Initialize the web server and connect to the database
initializeWebServer()