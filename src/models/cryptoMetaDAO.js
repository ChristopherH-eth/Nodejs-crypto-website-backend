import mongodb from "mongodb"
import Logger from "../utils/logger.js"
import { database } from "../database.js"

/**
 * @file cryptoMetaDAO.js
 * @author 0xChristopher
 * @brief 
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
    static async addMeta(metaDoc)
    {
        // Try to add the cryptocurrency to the database
        try 
        {
            // Return success or failure
            return await database.collection("metadata").insertOne(metaDoc)
        } 
        catch (e) 
        {
            Logger.error(`Unable to post cryptocurrency: ${e}`)
            return {error: e}
        }
    }

    static async updateMeta(metaDoc)
    {
        // TODO: Fill out function
        
        return
    }
}

export default CryptoMetaDAO