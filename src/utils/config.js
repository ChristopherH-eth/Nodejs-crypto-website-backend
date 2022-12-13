import * as dotenv from "dotenv"

/**
 * @file config.js
 * @author 0xChristopher
 * @brief This file handles the exporting of environment variables.
 */

dotenv.config()

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
const COINMARKETCAP_URL = process.env.COINMARKETCAP_URL
const MONGO_USERNAME = process.env.MONGO_USERNAME
const MONGO_PASSWORD = process.env.MONGO_PASSWORD

const update = {
    hour: 3600000,                      // 1 hour
    day: 86400000                       // 1 day
}

export {
    update,
    COINMARKETCAP_API_KEY, 
    COINMARKETCAP_URL,
    MONGO_USERNAME,
    MONGO_PASSWORD
}