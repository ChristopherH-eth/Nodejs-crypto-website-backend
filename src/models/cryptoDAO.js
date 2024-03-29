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
    static async addCrypto(cryptoDoc, testFlag)
    {
        // Collection to use
        let collection

        try 
        {
            // Check which collection should be accessed
            if (testFlag)
            {
                collection = "test_cryptocurrencies"
                Logger.test("Inserting " + cryptoDoc.name + " at id: " + cryptoDoc.id)
            }
            else
            {
                collection = "cryptocurrencies"
                Logger.info("Inserting " + cryptoDoc.name + " at id: " + cryptoDoc.id)
            }

            // Attempt to add new cryptocurrency
            const cryptoResponse = await database.collection(collection).insertOne(cryptoDoc)

            // Return response
            return cryptoResponse
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
    static async updateCryptoById(cryptoDoc)
    {
        // Collection to use
        let collection

        try 
        {
            // Check which collection should be accessed
            if (cryptoDoc.testFlag)
            {
                collection = "test_cryptocurrencies"
                Logger.test("Updating crypto by id: " + cryptoDoc.id + " or _id: " + cryptoDoc._id)
            }
            else
            {
                collection = "cryptocurrencies"
                Logger.info("Updating crypto by id: " + cryptoDoc.id + " or _id: " + cryptoDoc._id)
            }

            // Information to update
            const updateInfo = {
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
            }

            // Attempt to update cryptocurrency
            const updateResponse = await database.collection(collection).updateOne(
                {$or:
                    [
                        {_id: ObjectId(cryptoDoc._id)},
                        {id: cryptoDoc.id}
                    ]
                },
                {$set: updateInfo},
                {upsert: true}
            )
    
            // Return response
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
            // Attempt to update cryptocurrency logo
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
    
            // Return response
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
     * @param testFlag Boolean used for integration/unit testing
     * @return Returns the database response or an error to the controller
     */
    static async deleteCryptoById(cryptoId, testFlag)
    {
        // Collection to use
        let collection

        try 
        {
            // Check which collection should be accessed
            if (testFlag)
            {
                collection = "test_cryptocurrencies"
                Logger.test("Deleting crypto by id: " + cryptoId)
            }
            else
            {
                collection = "cryptocurrencies"
                Logger.info("Deleting crypto by id: " + cryptoId)
            }

            // Attempt to delete cryptocurrency
            const deleteResponse = await database.collection(collection).deleteOne({_id: ObjectId(cryptoId)})
        
            // Return response
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
     * @param testFlag Boolean used for integration/unit testing
     * @return Returns an array of cryptocurrency objects or an error
     */
    static async getCryptos(testFlag)
    {
        // Collection to use
        let collection

        try 
        {
            // Check which collection should be accessed
            if (testFlag)
            {
                collection = "test_cryptocurrencies"
                Logger.test("Retrieving all cryptocurrency documents")
            }
            else
            {
                collection = "cryptocurrencies"
                Logger.info("Retrieving all cryptocurrency documents")
            }

            // Attempt to get all cryptocurrency objects
            const cursor = await database.collection(collection).find({})

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
     * @param testFlag Boolean used for integration/unit testing
     * @return Returns a cryptocurrency object or an error
     */
    static async getCryptoById(cryptoId, testFlag)
    {
        // Collection to use
        let collection

        try 
        {
            // Check which collection should be accessed
            if (testFlag)
            {
                collection = "test_cryptocurrencies"
                Logger.test("Getting crypto by id: " + cryptoId)
            }
            else
            {
                collection = "cryptocurrencies"
                Logger.info("Getting crypto by id: " + cryptoId)
            }

            // Check if the cryptoId passed in is a valid ObjectId, then use correct method to find
            // cryptocurrency
            if (ObjectId.isValid(cryptoId))
            {
                const cryptoResponse = await database.collection(collection).findOne(
                    {$or:
                        [
                            {_id: ObjectId(cryptoId)},
                            {id: cryptoId}
                        ]
                    }
                )

                return cryptoResponse
            }
            else
            {
                const cryptoResponse = await database.collection(collection).findOne({id: parseInt(cryptoId)})

                return cryptoResponse
            }
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
    static async getCryptosByPage(limit, page, testFlag)
    {
        // Collection to use
        let collection

        try
        {
            // Check which collection should be accessed
            if (testFlag)
            {
                collection = "test_cryptocurrencies"
                Logger.test("Getting " + limit + " cryptos on page " + page)
            }
            else
            {
                collection = "cryptocurrencies"
                Logger.info("Getting " + limit + " cryptos on page " + page)
            }

            // Attempt to find cryptocurrencies on a specific page
            const cursor = await database.collection(collection).find({
                cmc_rank: {
                    $gte: (1 + (parseInt(limit) * (parseInt(page) - 1))),
                    $lte: (parseInt(limit) + (parseInt(limit) * (parseInt(page) - 1)))
                }
            }).sort({"quote.USD.market_cap": -1})

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
     * @param testFlag Boolean used for integration/unit testing
     * @returns Returns the number of cryptocurrency documents in the database
     */
    static async getCryptoCount(testFlag)
    {
        // Collection to use
        let collection

        try
        {
            // Check which collection should be accessed
            if (testFlag)
            {
                collection = "test_cryptocurrencies"
                Logger.test("Counting cryptocurrency documents")
            }
            else
            {
                collection = "cryptocurrencies"
                Logger.info("Counting cryptocurrency documents")
            }

            // Attempt to count the total number of cryptocurrency objects
            const countResponse = await database.collection(collection).count()

            // Return response
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