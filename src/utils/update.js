import { COINMARKETCAP_API_KEY, COINMARKETCAP_URL } from "../utils/config.js"
import CryptoDAO from "../models/cryptoDAO.js"
import Logger from "./logger.js"

/**
 * @file update.js
 * @author 0xChristopher
 * @brief 
 */

// Automatically update cryptocurrency data every hour
const updater = setInterval(async () => {
    await autoUpdateCryptos()
}, 3600000)

/**
 * @brief The autoUpdateCryptos() function runs hourly to update the top 200 cryptocurrencies by market
 *      cap in the database.
 */
async function autoUpdateCryptos()
{
    Logger.info("Updating database values hourly...")

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
        const priceUSD = cryptoDataArray[i].quote.USD.price

        // Attempt to update cryptocurrencies
        const cryptoResponse = await CryptoDAO.updateCrypto(
            cryptoId,
            name,
            symbol,
            maxSupply,
            circulatingSupply,
            totalSupply,
            priceUSD
        )
    }

    Logger.info("Routine crypto update complete")
}

/**
 * @brief The fetchCryptoData() function fetches the top 200 cryptocurrencies by market cap.
 * @returns Returns an array of objects representing the top 200 cryptocurrencies
 */
async function fetchCryptoData()
{
    let latestListings = "/v1/cryptocurrency/listings/latest"       // CMC latest listings endpoint

    return fetch(`${COINMARKETCAP_URL}${latestListings}`, {
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

export { updater, fetchCryptoData }