import { COINMARKETCAP_API_KEY, COINMARKETCAP_URL } from "../utils/config.js"
import CryptoDAO from "../models/cryptoDAO.js"
import Logger from "../utils/logger"

/**
 * @file crypto-controller.js
 * @author 0xChristopher
 * @brief 
 */

let latestListings = "/v1/cryptocurrency/listings/latest"       // CMC latest listings endpoint

class CryptoController 
{
    /**
     * @brief The apiPostCryptos() function handles POST requests consisting of an array of cryptocurrency
     *      JS objects.
     * @param req 
     * @param res 
     * @param next 
     */
    static async apiPostCryptos(req, res)
    {
        try
        {
            const cryptoData = await fetchCryptoData()                  // Crypto data returned by fetchCryptoData()
            const cryptoDataArray = cryptoData.data                     // Crypto data array

            for (var i = 0; i < cryptoDataArray.length; i++)
            {
                const cryptoId = cryptoDataArray[i].id
                const name = cryptoDataArray[i].name
                const symbol = cryptoDataArray[i].symbol
                const maxSupply = cryptoDataArray[i].max_supply
                const circulatingSupply = cryptoDataArray[i].circulating_supply
                const totalSupply = cryptoDataArray[i].total_supply

                // Attempt to add cryptocurrencies
                const cryptoResponse = await CryptoDAO.addCrypto(
                    cryptoId,
                    name,
                    symbol,
                    maxSupply,
                    circulatingSupply,
                    totalSupply
                )
            }

            res.json({status: "success"})
        }
        catch (e)
        {
            Logger.log(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }

    /**
     * @brief The apiUpdateCryptos() function handles PUT requests consisting of an array of cryptocurrency
     *      JS objects.
     * @param req 
     * @param res 
     * @param next 
     */
    static async apiUpdateCryptos(req, res)
    {
        try
        {
            const cryptoData = await fetchCryptoData()                  // Crypto data returned by fetchCryptoData()
            const cryptoDataArray = cryptoData.data                     // Crypto data array

            for (var i = 0; i < cryptoDataArray.length; i++)
            {
                const cryptoId = parseInt(req.params.cryptoId)
                const name = req.body.name
                const symbol = req.body.symbol
                const maxSupply = req.body.maxSupply
                const circulatingSupply = req.body.circulatingSupply
                const totalSupply = req.body.totalSupply

                // Attempt to update cryptocurrency value(s)
                const cryptoResponse = await CryptoDAO.updateCrypto(
                    cryptoId,
                    name,
                    symbol,
                    maxSupply,
                    circulatingSupply,
                    totalSupply
                )

                // Check if we received an error response
                var {error} = cryptoResponse

                if (error)
                    res.status(400).json({error})
            }

            // Check if we updated successfully
            if (cryptoResponse === 0)
                throw new Error("Unable to update crypto")

            res.json({status: "success"})
        }
        catch (e)
        {
            Logger.log(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }

    /**
     * @brief The apiDeleteCrypto() function handles DELETE requests for specific cryptocurrency objects.
     * @param req 
     * @param res 
     * @param next 
     */
    static async apiDeleteCrypto(req, res)
    {
        try
        {
            const cryptoId = req.params.id || {}                        // A cryptoId or an empty value
            const crypto = await CryptoDAO.deleteCrypto(cryptoId)       // Success or failure response of deleteCrypto()

            res.json({status: "success"})
        }
        catch (e)
        {
            Logger.log(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }

    /**
     * @brief The apiGetCryptoById() function handles GET requests for specific cryptocurrency objects.
     * @param req 
     * @param res 
     * @param next 
     * @returns Returns an error if no cryptocurrency was found
     */
    static async apiGetCryptoById(req, res)
    {
        try
        {
            let cryptoId = req.params.id || {}                          // A cryptoId or an empty value
            let crypto = await CryptoDAO.getCryptoById(cryptoId)        // crypto object returned by getCryptoById()

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
            Logger.log(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }

    /**
     * @brief The apiGetCryptos() function handles GET requests for all cryptocurrency objects.
     * @param req 
     * @param res 
     * @param next 
     * @returns Returns an error if no cryptocurrency was found
     */
     static async apiGetCryptos(req, res)
     {
         try
         {
             let crypto = await CryptoDAO.getCryptos()        // crypto object array returned by getCryptos()
 
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
             Logger.log(`api, ${e}`)
             res.status(500).json({error: e})
         }
     }
}

/**
 * @brief The fetchCryptoData() function fetches the top 100 cryptocurrencies by market cap.
 * @returns Returns an array of objects representing the top 100 cryptocurrencies
 */
async function fetchCryptoData()
{
    return fetch(`${COINMARKETCAP_URL}${latestListings}`, {
            headers: {
                "X-CMC_PRO_API_KEY": COINMARKETCAP_API_KEY
            },
            params: {
                sort: "market_cap",
                limit: 100
            }
        })
        .then((response) => response.json())
}

export default CryptoController