import { COINMARKETCAP_API_KEY, COINMARKETCAP_URL } from "../../config.js"

let cryptoData = {}
let latestListings = "/v1/cryptocurrency/listings/latest"

class CryptoController 
{
    static async apiUpdateDB(req, res)
    {
        try
        {
            fetch(`${COINMARKETCAP_URL}${latestListings}`, {
                    headers: {
                        "X-CMC_PRO_API_KEY": COINMARKETCAP_API_KEY
                    },
                    params: {
                        sort: "market_cap",
                        limit: 100
                    }
                })
                .then((response) => response.json())
                .then((data) => setCryptoData(data))
                .then(() => console.log(cryptoData))
        }
        catch (e)
        {
            console.log(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }
}

function setCryptoData(data)
{
    cryptoData = {...data}
}

export { CryptoController, cryptoData }