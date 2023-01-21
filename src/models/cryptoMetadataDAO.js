import mongodb from "mongodb"
import Logger from "../utils/logger.js"
import { database } from "../database.js"

/**
 * @file cryptoMetaDAO.js
 * @author 0xChristopher
 * @brief The Crypto Meta Data Access Object handles interactions with cryptocurrency data, and responds to
 *      the crypto-controller. Interactions include adding new cryptocurrency metadata, updating
 *      metadata, as well as deleting, and retrieving cryptocurrency metadata information.
 */

const ObjectId = mongodb.ObjectId                   // ObjectId for database entries

class CryptoMetaDAO
{
    /**
     * @brief The addMeta() function adds a cryptocurrency's metadata to the database.
     * @param metaDoc The cryptocurrency metadata object to add to the database; for detailed view of object 
     *      properties, refer to the updateMeta() function.
     * @returns Returns whether the request was successful or not
     */
    static async addMetadata(metaDoc, testFlag)
    {
        // Collection to use
        let collection
        
        try 
        {
            // Check which collection should be accessed
            if (testFlag)
            {
                collection = "test_metadata"
                Logger.test("Inserting " + metaDoc.name + " at id: " + metaDoc.id)
            }
            else
            {
                collection = "metadata"
                Logger.info("Inserting " + metaDoc.name + " at id: " + metaDoc.id)
            }

            // Return success or failure
            return await database.collection(collection).insertOne(metaDoc)
        } 
        catch (e) 
        {
            Logger.error(`Unable to post cryptocurrency: ${e}`)

            return {error: e}
        }
    }

    /**
     * @brief The updateMeta() function updates a cryptocurrency metadata in the database.
     * @param id The id of the cryptocurrency metadata
     * @param name Cryptocurrency name
     * @param symbol Cryptocurrency symbol
     * @param category
     * @param description
     * @param slug Cryptocurrency slug
     * @param logo
     * @param subreddit
     * @param notice
     * @param tags
     * @param urls
     * @param platform
     * @param date_added
     * @param twitter_username
     * @param is_hidden
     * @param date_launched
     * @param contract_address
     * @param self_reported_circulating_supply
     * @param self_reported_tags
     * @param self_reported_market_cap
     * @returns Returns whether the request was successful or not
     */
    static async updateMetadataById(metaDoc, testFlag)
    {
        // Collection to use
        let collection

        try 
        {
            // Check which collection should be accessed
            if (testFlag)
            {
                collection = "test_metadata"
                Logger.test("Updating metadata by id: " + metaDoc.id)
            }
            else
            {
                collection = "metadata"
                Logger.info("Updating metadata by id: " + metaDoc.id)
            }

            const updateResponse = await database.collection(collection).updateOne(
                {$or:
                    [
                        {_id: ObjectId(metaDoc.id)},
                        {id: metaDoc.id}
                    ]
                },
                {$set: {
                    id: metaDoc.id,
                    name: metaDoc.name,
                    symbol: metaDoc.symbol,
                    category: metaDoc.category,
                    description: metaDoc.description,
                    slug: metaDoc.slug,
                    logo: metaDoc.logo,
                    subreddit: metaDoc.subreddit,
                    notice: metaDoc.notice,
                    tags: metaDoc.tags,
                    // [tag-names]: metaDoc.tag-names,      --currently causes error
                    // [tag-groups]: metaDoc.tag-groups,    --currently causes error
                    urls: metaDoc.urls,
                    platform: metaDoc.platform,
                    date_added: metaDoc.date_added,
                    twitter_username: metaDoc.twitter_username,
                    is_hidden: metaDoc.is_hidden,
                    date_launched: metaDoc.date_launched,
                    contract_address: metaDoc.contract_address,
                    self_reported_circulating_supply: metaDoc.self_reported_circulating_supply,
                    self_reported_tags: metaDoc.self_reported_tags,
                    self_reported_market_cap: metaDoc.self_reported_market_cap
                }},
                {upsert: true}
            )
    
            return updateResponse
        } 
        catch (e) 
        {
            Logger.error(`Unable to update metadata: ${e}`)

            return {error: e}
        }
    }

    /**
     * @brief The getMetasByPage() function allows for paging of cryptocurrency metadata. It sends a request
     *      to the database to retrieve the current page's metadata and returns it to the frontend for
     *      rendering.
     * @param cryptos A string of cryptocurrency ids separated by commas
     * @return Returns an array of cryptocurrency metadata objects
     */
    static async getMetadataById(cryptos, testFlag)
    {
        // Collection to use
        let collection

        try
        {
            let cryptoArray = []                            // Array of cryptocurrency ids
            let metadataArray = []                          // Array of cryptocurrency metadata objects
            let start = 0                                   // Starting index for substring search

            // Check which collection should be accessed
            if (testFlag)
            {
                collection = "test_metadata"
                Logger.test("Getting metadata by page: " + cryptos)
            }
            else
            {
                collection = "metadata"
                Logger.info("Getting metadata by page: " + cryptos)
            }

            // Find substrings while additional ids exist
            while (true)
            {
                // Check if we've reached the last id; if so, push it onto array an break
                if (cryptos.search(",") === -1)
                {
                    cryptoArray.push(cryptos)

                    break
                }
                // There are additional ids to process
                else
                {
                    const crypto = cryptos.slice(0, cryptos.search(","))
                    start = cryptos.search(",") + 1
                    cryptos = cryptos.slice(start)
                    cryptoArray.push(crypto)
                }
            }

            // Iterate over the id array and find matching metadata objects to return
            for (var i = 0; i < cryptoArray.length; i++)
            {
                const metadataResponse = await database.collection(collection).findOne({
                    id: parseInt(cryptoArray[i])
                })

                if (metadataResponse)
                {
                    metadataArray.push({
                        category: metadataResponse.category,
                        description: metadataResponse.description,
                        id: metadataResponse.id,
                        logo: metadataResponse.logo,
                        name: metadataResponse.name,
                        slug: metadataResponse.slug,
                        subreddit: metadataResponse.subreddit,
                        symbol: metadataResponse.symbol,
                        tags: metadataResponse.tags,
                        urls: metadataResponse.urls
                    })
                }
            }

            // If the array is empty return nothing
            if (metadataArray.length === 0)
                return

            return metadataArray
        }
        catch (e)
        {
            Logger.error(`Unable to get page: ${e}`)

            return {error: e}
        }
    }

    /**
     * @brief The deleteMetadata() function
     */
    static async deleteMetadataById(metadataId, testFlag)
    {
        // Collection to use
        let collection
        
        try 
        {
            // Check which collection should be accessed
            if (testFlag)
            {
                collection = "test_metadata"
                Logger.test("Deleting metadata at id: " + metadataId)
            }
            else
            {
                collection = "metadata"
                Logger.info("Deleting metadata at id: " + metadataId)
            }

            // Return success or failure
            return await database.collection(collection).deleteOne({id: metadataId})
        } 
        catch (e) 
        {
            Logger.error(`Unable to post cryptocurrency: ${e}`)

            return {error: e}
        }
    }
}

export default CryptoMetaDAO