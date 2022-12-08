import * as dotenv from "dotenv"

/**
 * @file config.js
 * @author 0xChristopher
 * @brief 
 */

dotenv.config()

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
const COINMARKETCAP_URL = process.env.COINMARKETCAP_URL
const MONGO_USERNAME = process.env.MONGO_USERNAME
const MONGO_PASSWORD = process.env.MONGO_PASSWORD

export {
    COINMARKETCAP_API_KEY, 
    COINMARKETCAP_URL,
    MONGO_USERNAME,
    MONGO_PASSWORD
}