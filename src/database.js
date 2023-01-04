import Logger from "./utils/logger.js"

/**
 * @file database.js
 * @author 0xChristopher
 * @brief This file handles the database connection request from index.js. It checks to make sure we don't
 *      already have a connection before attempting to connect to the MongoDB datbase.
 */

let database                    // Database connection

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

export { injectDB, database }