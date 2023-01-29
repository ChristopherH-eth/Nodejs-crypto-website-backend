import CryptoMetadataDAO from "../models/cryptoMetadataDAO.js"
import Logger from "../utils/logger.js"
import { responseHandler } from "../utils/helpers.js"

/**
 * @file metadata-controller.js
 * @author 0xChristopher
 * @brief This file is responsible for directing all metadata related API calls to the correct model
 *      for handling.
 */

class MetadataController
{
    /**
     * @brief The apiPostMetas() function handles POST requests consisting of an map of cryptocurrency
     *      metadata JS objects.
     * @param req Incoming request
     * @param res Outgoing response
     */
    static async apiPostMetadata(req, res, next)
    {
        try
        {
            const testFlag = req.query.test                                     // Test flag
            const metadata = req.body                                           // Crypto metadata
            const metadataId = req.body.id                                      // Metadata id

            // Check for required parameters
            if (!metadataId)
            {
                res.status(400).json({error: "Missing required parameters"})

                return
            }
            
            // Success or failure response of addMetadata()
            const metadataResponse = await CryptoMetadataDAO.addMetadata(metadata, testFlag)

            // Handle error responses
            if (!await responseHandler(res, metadataResponse))
                res.json({status: "success"})
        }
        catch (e)
        {
            Logger.error(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }

    /**
     * @brief The apiUpdateMetadata() function attempts to update the metadata object of a cryptocurrency.
     * @param req Incoming request
     * @param res Outgoing response
     */
    static async apiUpdateMetadataById(req, res, next)
    {
        try
        {
            const testFlag = req.query.test                                     // Test flag
            const metadata = req.body                                           // Crypto metadata
            const metadataId = req.body.id                                      // Metadata id

            // Check for required parameters
            if (!metadataId)
            {
                res.status(400).json({error: "Missing required parameters"})

                return
            }

            // Success or failure response of addMetadata()
            const metadataResponse = await CryptoMetadataDAO.updateMetadataById(metadata, testFlag)

            // Handle error responses
            if (!await responseHandler(res, metadataResponse))
                res.json({status: "success"})
        }
        catch (e)
        {
            Logger.error(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }

    /**
     * @brief The apiGetMetasByPage() function attempts to get a specified number of cryptocurrency
     *      metadata objects for the given page the user has navigated to.
     * @param req Incoming request
     * @param res Outgoing response
     * @return Returns the requested array of cryptocurrency metadata objects or an error
     */
    static async apiGetMetadataById(req, res, next)
    {
        try
        {
            const cryptos = req.query.cryptos                               // String of cryptocurrency ids
            const testFlag = req.query.test                                 // Test flag
            
            // Check for required parameters
            if (!cryptos)
            {
                res.status(400).json({error: "Missing required parameters"})

                return
            }

            // Metadata object array returned by getMetasById()
            const metadataResponse = await CryptoMetadataDAO.getMetadataById(cryptos, testFlag)

            // Handle error responses
            if (!await responseHandler(res, metadataResponse))
                res.json(metadataResponse)
        }
        catch (e)
        {
            Logger.error(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }

    /**
     * @brief The apiDeleteMetadataById() function attempts to delete a metadata object from the database
     *      via its id.
     * @param req Incoming request
     * @param res Outgoing response
     */
    static async apiDeleteMetadataById(req, res, next)
    {
        try
        {
            const testFlag = req.query.test                                 // Test flag
            const metadataId = req.query.metadataId                         // Crypto metadata id
        
            // Check for required parameters
            if (!metadataId)
            {
                res.status(400).json({error: "Missing required parameters"})

                return
            }

            // Success or failure response of addMetadata()
            const metadataResponse = await CryptoMetadataDAO.deleteMetadataById(metadataId, testFlag)

            // Handle error responses
            if (!await responseHandler(res, metadataResponse))
                res.json({status: "success"})
        }
        catch (e)
        {
            Logger.error(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }
}

export default MetadataController