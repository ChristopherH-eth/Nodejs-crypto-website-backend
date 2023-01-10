import { fetchMetadata, cryptoData } from "../utils/update.js"
import CryptoMetadataDAO from "../models/cryptoMetadataDAO.js"
import Logger from "../utils/logger.js"

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
    static async apiPostMetas(req, res, next)
    {
        try
        {
            const metadata = await fetchMetadata()                  // Crypto metadata returned by fetchMetadata()
            const metadataMap = metadata.data                       // Crypto metadata map

            for (var i = 0; i < cryptoData.data.length; i++)
            {
                // Attempt to add crypto metadata
                const metaResponse = await CryptoMetadataDAO.addMeta(metadataMap[cryptoData.data[i].id])
            }

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
    static async apiGetMetasByPage(req, res, next)
    {
        try
        {
            const cryptos = req.query.cryptos
            const metadata = await CryptoMetadataDAO.getMetasByPage(cryptos)        // crypto object array returned by getMetasByPage()

            // Check if we received a valid response
            if (!metadata)
            {
                res.status(404).json({error: "Not found"})

                return
            }

            res.json(metadata)
        }
        catch (e)
        {
            Logger.error(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }
}

export default MetadataController