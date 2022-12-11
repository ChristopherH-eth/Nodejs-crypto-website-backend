import { COINMARKETCAP_API_KEY, COINMARKETCAP_URL } from "../utils/config.js"
import { CryptoDAO } from "../models/cryptoDAO.js"
import CryptoMetaDAO from "../models/cryptoMetaDAO.js"
import Logger from "./logger.js"

/**
 * @file update.js
 * @author 0xChristopher
 * @brief This file updates the cryptocurrency database automatically at given intervals. The 'priceUpdater'
 *      handles updating various price related metrics every hour, while the 'metaUpdater' handles updating
 *      each cryptocurrency's metadata daily.
 */

// JSON response of the most recent CMC listing API call
var cryptoData = {}

// Automatically update cryptocurrency price data every hour
const priceUpdater = setInterval(async () => {
    await autoUpdateCryptos()
}, 30000)   // 1 hour

// Automatically update cryptocurrency metadata daily
const metaUpdater = setInterval(async () => {
    await autoUpdateMetadata()
}, 40000)   // 1 day

/**
 * @brief The autoUpdateCryptos() function runs hourly to update the top 200 cryptocurrencies by market
 *      cap in the database.
 */
async function autoUpdateCryptos()
{
    Logger.info("Updating database values hourly...")

    cryptoData = await fetchCryptoData()                        // Crypto data returned by fetchCryptoData()
    const cryptoDataArray = cryptoData.data                     // Crypto data array

    for (var i = 0; i < cryptoDataArray.length; i++)
    {
        // Attempt to update cryptocurrencies
        const cryptoResponse = await CryptoDAO.updateCrypto(cryptoDataArray[i])
    }

    Logger.info("Routine crypto update complete")
}

/**
 * @brief The autoUpdateMetadata() function
 */
async function autoUpdateMetadata()
{
    Logger.info("Updating metadata values daily...")

    if (cryptoData !== "")
    {
        const metadata = await fetchMetadata()                  // Crypto metadata returned by fetchMetadata()
        const metadataMap = metadata.data                       // Crypto metadata map

        for (var i = 0; i < cryptoData.data.length; i++)
        {
            // Attempt to update crypto metadata
            const metaResponse = await CryptoMetaDAO.updateMeta(metadataMap[cryptoData.data[i].id])
        }
    }

    Logger.info("Routine metadata update complete")
}

/**
 * @brief The fetchCryptoData() function fetches the top 200 cryptocurrencies by market cap.
 * @returns Returns an array of objects representing the top 200 cryptocurrencies
 */
async function fetchCryptoData()
{
    const latestListingsURL = "/v1/cryptocurrency/listings/latest"      // CMC latest listings endpoint

    // Crypto data API call to CMC
    return fetch(`${COINMARKETCAP_URL}${latestListingsURL}`, {
            headers: {
                "X-CMC_PRO_API_KEY": COINMARKETCAP_API_KEY
            },
            params: {
                sort: "market_cap",
                limit: 200
            }
        })
        .then((response) => response.json())
}

/**
 * @brief The fetchMetadata() function
 */
async function fetchMetadata()
{
    const metadataURL = "/v2/cryptocurrency/info"                       // CMC metadata
    const cryptoDataArray = cryptoData.data                             // Crypto data array
    var metadataIds = ""                                                // String of most recently fetched crypto ids

    // Get the most recent updated cryptocurrencies and store their ids
    for (var i = 0; i < cryptoDataArray.length; i++)
    {
        if (metadataIds === "")
        {
            let id = cryptoDataArray[i].id.toString()
            metadataIds = metadataIds.concat(id)
        }
        else
        {
            let id = cryptoDataArray[i].id.toString()
            metadataIds = metadataIds.concat(",", id)
        }
    }

    const params = `?id=${metadataIds}`                                 // Query parameters to append to url

    // Metadata API call to CMC
    return fetch(`${COINMARKETCAP_URL}${metadataURL}${params}`, {
            headers: {
                "X-CMC_PRO_API_KEY": COINMARKETCAP_API_KEY
            }
        })
        .then((response) => response.json())
}

export { fetchCryptoData, fetchMetadata, cryptoData }