import mongodb from "mongodb"
import Logger from "../utils/logger"

/**
 * @file cryptoDAO.js
 * @author 0xChristopher
 * @brief 
 */

const ObjectId = mongodb.ObjectId                   // ObjectId for database entries
let cryptocurrencies                                // Connection variable for database collection

class CryptoDAO
{
    /**
     * @brief The injectDB() function connects the client to the database.
     * @param conn The client instance
     * @returns Returns if there is already an established database connection
     */
    static async injectDB(conn)
    {
        // Check if we already have an established connection
        if (cryptocurrencies)
            return
        
        // Try to connect to database or else log error
        try
        {
            cryptocurrencies = await conn.db("cryptocurrencies").collection("cryptocurrencies")
        }
        catch (e)
        {
            Logger.error(`Unable to establish connection handles in userDAO: ${e}`)
        }
    }

    /**
     * @brief The addCrypto() function adds a cryptocurrency to the database
     * @param cryptoId The id of the cryptocurrency
     * @param name Cryptocurrency name
     * @param symbol Cryptocurrency symbol
     * @param maxSupply Maximum supply of the token/coin
     * @param circulatingSupply Circulating supply of the token/coin
     * @param totalSupply Total supply of the token/coin
     * @returns Returns whether the request was successful or not
     */
    static async addCrypto(cryptoId, name, symbol, maxSupply, circulatingSupply, totalSupply)
    {
        // Try to add the cryptocurrency to the database
        try 
        {
            const cryptoDoc = {
                cryptoId: cryptoId,
                name: name,
                symbol: symbol,
                maxSupply: maxSupply,
                circulatingSupply: circulatingSupply,
                totalSupply: totalSupply
            }

            // Return success or failure
            return await cryptocurrencies.insertOne(cryptoDoc)
        } 
        catch (e) 
        {
            Logger.error(`Unable to post cryptocurrency: ${e}`)
            return {error: e}
        }
    }

    /**
     * 
     */
    static async updateCrypto()
    {
        // TODO: fill out function
    }

    /**
     * 
     */
    static async deleteCrypto()
    {
        // TODO: fill out function
    }

    /**
     * @brief The getCryptos() function interacts with the database to get all stored cryptocurrency objects
     *      and store them in an array.
     * @return Returns an array of cryptocurrency objects or an error
     */
    static async getCryptos()
    {
        try 
        {
            const cursor = await cryptocurrencies.find({})

            return cursor.toArray()
        } 
        catch (e) 
        {
            Logger.error(`Unable to get review: ${e}`)

            return {error: e}
        }
    }

    /**
     * @brief The getCryptoById() function queries the database for a specific cryptocurrency object.
     * @param cryptoId The unique id of a cryptocurrency object
     */
    static async getCryptoById(cryptoId)
    {
        try 
        {
            return await cryptocurrencies.findOne({cryptoId: parseInt(cryptoId)})
        } 
        catch (e) 
        {
            Logger.error(`Unable to get review: ${e}`)

            return {error: e}
        }
    }
}

export default CryptoDAO