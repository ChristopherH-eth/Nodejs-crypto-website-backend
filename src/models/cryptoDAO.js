import mongodb from "mongodb"
import Logger from "../utils/logger.js"
import { database } from "../database.js"

/**
 * @file cryptoDAO.js
 * @author 0xChristopher
 * @brief 
 */

const ObjectId = mongodb.ObjectId                   // ObjectId for database entries

class CryptoDAO
{
    /**
     * @brief The addCrypto() function adds a cryptocurrency to the database.
     * @param cryptoDoc The cryptocurrency object to add to the database; for detailed view of object 
     *      properties, refer to the updateCrypto() function.
     * @returns Returns whether the request was successful or not
     */
    static async addCrypto(cryptoDoc)
    {
        // Try to add the cryptocurrency to the database
        try 
        {
            // Return success or failure
            return await database.collection("cryptocurrencies").insertOne(cryptoDoc)
        } 
        catch (e) 
        {
            Logger.error(`Unable to post cryptocurrency: ${e}`)
            return {error: e}
        }
    }

    /**
     * @brief The updateCrypto() function updates a cryptocurrency in the database.
     * @param id The id of the cryptocurrency
     * @param name Cryptocurrency name
     * @param symbol Cryptocurrency symbol
     * @param slug Cryptocurrency slug
     * @param num_market_pairs
     * @param date_added
     * @param tags
     * @param max_supply Maximum supply of the token/coin
     * @param circulating_supply Circulating supply of the token/coin
     * @param total_supply Total supply of the token/coin
     * @param platform
     * @param cmc_rank
     * @param self_reported_circulating_supply
     * @param self_reported_market_cap
     * @param tvl_ratio
     * @param last_updated
     * @param quote
     * @param quote.USD.price Price of the cryptocurrency in USD
     * @returns Returns whether the request was successful or not
     */
    static async updateCrypto(cryptoDoc)
    {
        try 
        {
            const updateResponse = await database.collection("cryptocurrencies").updateOne(
                {$or:
                    [
                        {_id: ObjectId(cryptoDoc.id)},
                        {id: cryptoDoc.id}
                    ]
                },
                {$set: {
                    id: cryptoDoc.id,
                    name: cryptoDoc.name,
                    symbol: cryptoDoc.symbol,
                    slug: cryptoDoc.slug,
                    num_market_pairs: cryptoDoc.num_market_pairs,
                    date_added: cryptoDoc.date_added,
                    tags: cryptoDoc.tags,
                    max_supply: cryptoDoc.max_supply,
                    circulating_supply: cryptoDoc.circulating_supply,
                    total_supply: cryptoDoc.total_supply,
                    platform: cryptoDoc.platform,
                    cmc_rank: cryptoDoc.cmc_rank,
                    self_reported_circulating_supply: cryptoDoc.self_reported_circulating_supply,
                    self_reported_market_cap: cryptoDoc.self_reported_market_cap,
                    tvl_ratio: cryptoDoc.tvl_ratio,
                    last_updated: cryptoDoc.last_updated,
                    quote: cryptoDoc.quote
                }}
            )
    
            return updateResponse
        } 
        catch (e) 
        {
            Logger.error(`Unable to update cryptocurrency: ${e}`)
            return {error: e}
        }
    }

    /**
     * @brief The deleteCrypto() function removes a cryptocurrency entry from the database by its
     *      derived ObjectId.
     * @param cryptoId The cryptocurrency's unique assigned identifier
     * @return Returns the database response or an error to the controller
     */
    static async deleteCrypto(cryptoId)
    {
        try 
        {
            const deleteResponse = await database.collection("cryptocurrencies")
                .deleteOne({_id: ObjectId(cryptoId)})
        
            return deleteResponse
        } 
        catch (e) 
        {
            Logger.error(`Unable to delete crypto: ${e}`)

            return {error: e}
        }
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
            const cursor = await database.collection("cryptocurrencies").find({})

            return cursor.toArray()
        } 
        catch (e) 
        {
            Logger.error(`Unable to get cryptos: ${e}`)

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
            return await database.collection("cryptocurrencies").findOne({_id: ObjectId(cryptoId)})
        } 
        catch (e) 
        {
            Logger.error(`Unable to get crypto: ${e}`)

            return {error: e}
        }
    }
}

export { CryptoDAO }