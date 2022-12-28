import mongodb from "mongodb"
import Logger from "../utils/logger.js"
import { database } from "../database.js"

/**
 * @file cryptoDAO.js
 * @author 0xChristopher
 * @brief The Crypto Data Access Object handles interactions with cryptocurrency data, and responds to
 *      the crypto-controller. Interactions include adding new cryptocurrencies, updating cryptocurrencies, 
 *      as well as deleting, and retrieving cryptocurrency information.
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
                }},
                {upsert: true}
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
     * @brief The updateLogoFromMetadata() function updates the cryptocurrency logo in the corresponding
     *      cryptocurrency document in the database for convenient use when pulling data.
     * @param id The id of the cryptocurrency
     * @param logo The logo of the cryptocurrency
     * @returns Returns whether the request was successful or not
     */
    static async updateLogoFromMetadata(cryptoDoc)
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
                    logo: cryptoDoc.logo
                }},
                {upsert: true}
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
        Logger.info("Getting crypto by id: " + cryptoId)

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

    /**
     * @brief The getCryptosByPage() function allows for paging of cryptocurrencies. It sends a request
     *      to the database to retrieve the current limit of cryptocurrencies to display, the current
     *      page the user is on, and sorts them by 'cmc_rank'.
     * @param limit The number of cryptocurrencies per page
     * @param page The current page
     * @return Returns an array of cryptocurrency objects
     */
    static async getCryptosByPage(limit, page)
    {
        try
        {
            const cursor = await database.collection("cryptocurrencies").find({
                cmc_rank: {
                    $gte: (1 + (parseInt(limit) * (parseInt(page) - 1))),
                    $lte: (parseInt(limit) + (parseInt(limit) * (parseInt(page) - 1)))
                }
            }).sort({cmc_rank: 1})

            return cursor.toArray()
        }
        catch (e)
        {
            Logger.error(`Unable to get page: ${e}`)

            return {error: e}
        }
    }

    /**
     * @brief The getCryptoCount() function requests a count of the number of cryptocurrency documents
     *      in the database.
     * @returns Returns the number of cryptocurrency documents in the database
     */
    static async getCryptoCount()
    {
        try
        {
            const countResponse = await database.collection("cryptocurrencies").count()

            return countResponse
        }
        catch (e)
        {
            Logger.error(`Unable to get crypto count: ${e}`)

            return {error: e}
        }
    }
}

export default CryptoDAO