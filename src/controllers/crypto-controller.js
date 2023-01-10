import { fetchCryptoData } from "../utils/update.js"
import CryptoDAO from "../models/cryptoDAO.js"
import Logger from "../utils/logger.js"

/**
 * @file crypto-controller.js
 * @author 0xChristopher
 * @brief This file is responsible for directing all cryptocurrency related API calls to the correct model
 *      for handling.
 */

/**
 * @brief The responseHandler() function checks data from a database operation and checks for error responses
 *      to handle.
 * @param res Outgoing response
 * @param data The data to be checked
 * @return Returns 'true' if an error response was handled
 */
async function responseHandler(res, data)
{
    // Check if we received a valid crypto object
    if (!data)
    {
        res.status(404).json({error: "Not found"})
        
        return true
    }

    // Check if we received an error response
    const {error} = data

    if (error)
    {
        res.status(400).json({error})

        return true
    }
}

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
    static async apiUpdateCryptoById(req, res, next)
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
            const cryptoResponse = await CryptoDAO.updateCryptoById(
                cryptoId,
                name,
                symbol,
                maxSupply,
                circulatingSupply,
                totalSupply,
                priceUSD
            )

            // Check if we received an error response
            const {error} = cryptoResponse

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
    static async apiDeleteCryptoById(req, res, next)
    {
        try
        {
            const cryptoId = req.query.cryptoId || {}                               // A cryptoId or an empty value
            const testFlag = req.query.test || {}                                   // Test flag
            const crypto = await CryptoDAO.deleteCryptoById(cryptoId, testFlag)     // Success or failure response of deleteCrypto()

            if (!await responseHandler(res, crypto))
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
     * @returns Returns a cryptocurrency object or an error if no cryptocurrency was found
     */
    static async apiGetCryptoById(req, res, next)
    {
        try
        {
            const cryptoId = req.query.cryptoId || {}                               // A cryptoId or an empty value
            const testFlag = req.query.test || {}                                   // Test flag
            const crypto = await CryptoDAO.getCryptoById(cryptoId, testFlag)        // crypto object returned by getCryptoById()

            if (!await responseHandler(res, crypto))
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
     * @returns Returns all cryptocurrency objects or an error if no cryptocurrency was found
     */
    static async apiGetCryptos(req, res, next)
    {
        try
        {
            const testFlag = req.query.test || {}                       // Test flag
            const crypto = await CryptoDAO.getCryptos(testFlag)         // crypto object array returned by getCryptos()

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
            const limit = req.query.limit                                       // Cryptocurrencies per page
            const page = req.query.page                                         // Page number
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

    /**
     * @brief The apiGetCryptoCount() function attempts to get a count of the number of cryptocurrency 
     *      documents in the database; used for paging.
     * @param req Incoming request
     * @param res Outgoing response
     */
    static async apiGetCryptoCount(req, res, next)
    {
        try
        {
            const testFlag = req.query.test || {}                               // Test flag
            const cryptoCount = await CryptoDAO.getCryptoCount(testFlag)        // Total number of cryptocurrency documents

            if (!await responseHandler(res, cryptoCount))
                res.json(cryptoCount)
        }
        catch (e)
        {
            Logger.error(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }
}

export default CryptoController