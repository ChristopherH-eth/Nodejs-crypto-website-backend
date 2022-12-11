/**
 * @file database.js
 * @author 0xChristopher
 * @brief 
 */

let database

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
        Logger.error(`Unable to establish connection handles in cryptoDAO: ${e}`)
    }
}

export { injectDB, database }