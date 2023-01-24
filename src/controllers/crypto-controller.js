import CryptoDAO from "../models/cryptoDAO.js"
import Logger from "../utils/logger.js"
import { responseHandler } from "../utils/helpers.js"

/**
 * @file crypto-controller.js
 * @author 0xChristopher
 * @brief This file is responsible for directing all cryptocurrency related API calls to the correct model
 *      for handling.
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
            const cryptoData = req.body                                         // Crypto data
            const testFlag = req.query.test                                     // Test flag

            // Check for required parameters
            if (!cryptoData.id)
            {
                res.status(400).json({error: "Missing required parameters"})

                return
            }

            // Success or failure response of addCrypto()
            const cryptoResponse = await CryptoDAO.addCrypto(cryptoData, testFlag)

            // Handle error responses
            if (!await responseHandler(res, cryptoResponse))
                res.json(cryptoResponse)
            else
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
            const cryptoDoc = {
                _id: req.query.cryptoId,                                            // A cryptoId ObjectId or an empty value
                id: req.body.id,                                                    // A cryptocurrency CMC id
                testFlag: req.query.test,                                           // Test flag
                name: req.body.name,
                symbol: req.body.symbol,
                slug: req.body.slug,
                num_market_pairs: req.body.num_market_pairs,
                date_added: req.body.date_added,
                tags: req.body.tags,
                max_supply: req.body.max_supply,
                circulating_supply: req.body.circulating_supply,
                total_supply: req.body.total_supply,
                platform: req.body.platform,
                cmc_rank: req.body.cmc_rank,
                self_reported_circulating_supply: req.body.self_reported_circulating_supply,
                self_reported_market_cap: req.body.self_reported_market_cap,
                tvl_ratio: req.body.tvl_ratio,
                last_updated: req.body.last_updated,
                quote: req.body.quote
            }

            // Check for required parameters
            if (!cryptoDoc._id && !cryptoDoc.id)
            {
                res.status(400).json({error: "Missing required parameters"})

                return
            }
            
            // Success or failure response of updateCryptoById()
            const cryptoResponse = await CryptoDAO.updateCryptoById(cryptoDoc)

            // Handle error responses
            if (!await responseHandler(res, cryptoResponse))
            {
                // Check if we updated successfully
                if (cryptoResponse === 0)
                    throw new Error("Unable to update crypto")
                else
                    res.json({status: "success"})
            }
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
            const cryptoId = req.query.cryptoId                             // A cryptoId or an empty value
            const testFlag = req.query.test                                 // Test flag

            // Check for required parameters
            if (!cryptoId)
            {
                res.status(400).json({error: "Missing required parameters"})

                return
            }

            // Success or failure response of deleteCryptoById()
            const cryptoResponse = await CryptoDAO.deleteCryptoById(cryptoId, testFlag)

            // Handle error responses
            if (!await responseHandler(res, cryptoResponse))
            {
                if (cryptoResponse.deletedCount === 0)
                    res.status(404).json({error: "Not found"})
                else
                    res.json({status: "success"})
            }
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
            const cryptoId = req.query.cryptoId                             // A cryptoId or an empty value
            const testFlag = req.query.test                                 // Test flag

            // Check for required parameters
            if (!cryptoId)
            {
                res.status(400).json({error: "Missing required parameters"})

                return
            }

            // crypto object returned by getCryptoById()
            const cryptoResponse = await CryptoDAO.getCryptoById(cryptoId, testFlag)

            // Handle error responses
            if (!await responseHandler(res, cryptoResponse))
                res.json(cryptoResponse)
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
            const testFlag = req.query.test                                     // Test flag

            // crypto object array returned by getCryptos()
            const cryptoResponse = await CryptoDAO.getCryptos(testFlag)

            // Handle error responses
            if (!await responseHandler(res, cryptoResponse))
                res.json(cryptoResponse)
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
            const limit = req.query.limit                                   // Cryptocurrencies per page
            const page = req.query.page                                     // Page number
            const testFlag = req.query.test                                 // Test flag

            // Check for required parameters
            if (!limit || !page)
            {
                res.status(400).json({error: "Missing required parameters"})

                return
            }

            // crypto object array returned by getCryptosByPage()
            const cryptoResponse = await CryptoDAO.getCryptosByPage(limit, page, testFlag)

            // Handle error responses
            if (!await responseHandler(res, cryptoResponse))
                res.json(cryptoResponse)
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
            const testFlag = req.query.test                                         // Test flag

            // Total number of cryptocurrency documents returned by getCryptoCount()
            const cryptoResponse = await CryptoDAO.getCryptoCount(testFlag)         

            // Handle error responses
            if (!await responseHandler(res, cryptoResponse))
                res.json(cryptoResponse)
        }
        catch (e)
        {
            Logger.error(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }
}

export default CryptoController