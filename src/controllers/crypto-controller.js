import { fetchCryptoData, fetchMetadata, cryptoData } from "../utils/update.js"
import CryptoDAO from "../models/cryptoDAO.js"
import CryptoMetaDAO from "../models/cryptoMetaDAO.js"
import Logger from "../utils/logger.js"

/**
 * @file crypto-controller.js
 * @author 0xChristopher
 * @brief This file is responsible for directing all cryptocurrency related API calls to the correct model
 *      for handling. This is currently the default controller for both standard crypto data, as well as
 *      crypto metadata.
 */

class CryptoController 
{
    /**
     * @brief The apiPostCryptos() function handles POST requests consisting of an array of cryptocurrency
     *      JS objects.
     * @param req Incoming request
     * @param res Outgoing response
     */
    static async apiPostCryptos(req, res, next)
    {
        try
        {
            const cryptoData = await fetchCryptoData()                  // Crypto data returned by fetchCryptoData()
            const cryptoDataArray = cryptoData.data                     // Crypto data array

            for (var i = 0; i < cryptoDataArray.length; i++)
            {
                // Attempt to add cryptocurrencies
                const cryptoResponse = await CryptoDAO.addCrypto(cryptoDataArray[i])
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
     * @brief The apiUpdateCryptos() function handles PUT requests consisting of an array of cryptocurrency
     *      JS objects.
     * @param req Incoming request
     * @param res Outgoing response
     */
    static async apiUpdateCrypto(req, res, next)
    {
        try
        {
            const cryptoId = req.params.cryptoId
            const name = req.body.name
            const symbol = req.body.symbol
            const maxSupply = req.body.maxSupply
            const circulatingSupply = req.body.circulatingSupply
            const totalSupply = req.body.totalSupply
            const priceUSD = req.body.priceUSD

            // Attempt to update cryptocurrency value(s)
            const cryptoResponse = await CryptoDAO.updateCrypto(
                cryptoId,
                name,
                symbol,
                maxSupply,
                circulatingSupply,
                totalSupply,
                priceUSD
            )

            // Check if we received an error response
            var {error} = cryptoResponse

            if (error)
            {
                res.status(400).json({error})
                return
            }

            // Check if we updated successfully
            if (cryptoResponse === 0)
                throw new Error("Unable to update crypto")

            res.json({status: "success"})
        }
        catch (e)
        {
            Logger.error(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }

    /**
     * @brief The apiDeleteCrypto() function handles DELETE requests for specific cryptocurrency objects.
     * @param req Incoming request
     * @param res Outgoing response
     */
    static async apiDeleteCrypto(req, res, next)
    {
        try
        {
            const cryptoId = req.params.cryptoId || {}                  // A cryptoId or an empty value
            const crypto = await CryptoDAO.deleteCrypto(cryptoId)       // Success or failure response of deleteCrypto()

            res.json({status: "success"})
        }
        catch (e)
        {
            Logger.error(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }

    /**
     * @brief The apiGetCryptoById() function handles GET requests for specific cryptocurrency objects.
     * @param req Incoming request
     * @param res Outgoing response
     * @returns Returns an error if no cryptocurrency was found
     */
    static async apiGetCryptoById(req, res, next)
    {
        try
        {
            const cryptoId = req.params.cryptoId || {}                    // A cryptoId or an empty value
            const crypto = await CryptoDAO.getCryptoById(cryptoId)        // crypto object returned by getCryptoById()

            // Check if we received a valid crypto object
            if (!crypto)
            {
                res.status(404).json({error: "Not found"})
                
                return
            }

            res.json(crypto)
        }
        catch (e)
        {
            Logger.error(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }

    /**
     * @brief The apiGetCryptos() function handles GET requests for all cryptocurrency objects.
     * @param req Incoming request
     * @param res Outgoing response
     * @returns Returns an error if no cryptocurrency was found
     */
    static async apiGetCryptos(req, res, next)
    {
        try
        {
            const crypto = await CryptoDAO.getCryptos()        // crypto object array returned by getCryptos()

            // Check if we received a valid response
            if (!crypto)
            {
                res.status(404).json({error: "Not found"})

                return
            }

            res.json(crypto)
        }
        catch (e)
        {
            Logger.error(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }
    
    /**
     * @brief The apiGetCryptosByPage() function attempts to get a specified number of cryptocurrency
     *      objects for the given page the user has navigated to.
     * @param req Incoming request
     * @param res Outgoing response
     * @return Returns the requested array of cryptocurrency objects or an error
     */
    static async apiGetCryptosByPage(req, res, next)
    {
        try
        {
            const limit = req.params.limit
            const page = req.params.page
            const crypto = await CryptoDAO.getCryptosByPage(limit, page)        // crypto object array returned by getCryptosByPage()

            // Check if we received a valid response
            if (!crypto)
            {
                res.status(404).json({error: "Not found"})

                return
            }

            res.json(crypto)
        }
        catch (e)
        {
            Logger.error(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }

    static async apiGetCryptoCount(req, res, next)
    {
        try
        {
            const cryptoCount = await CryptoDAO.getCryptoCount()

            res.json(cryptoCount)
        }
        catch (e)
        {
            Logger.error(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }

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
                const metaResponse = await CryptoMetaDAO.addMeta(metadataMap[cryptoData.data[i].id])
            }

            res.json({status: "success"})
        }
        catch (e)
        {
            Logger.error(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }
}

export default CryptoController