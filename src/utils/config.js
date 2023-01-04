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

const URL = "https://localhost/api/v1/crypto/"

const ENDPOINTS = {
    cryptos: "/new",
    metas: "/new/meta",
    cryptoCount: "/all",
    cryptosByPage: "/pages/:page/:limit",
    metasByPage: "/meta/",
    cryptoById: "/:cryptoId"
}

const UPDATE = {
    hour: 3600000,                      // 1 hour
    day: 86400000                       // 1 day
}

export {
    UPDATE,
    URL,
    ENDPOINTS,
    COINMARKETCAP_API_KEY, 
    COINMARKETCAP_URL,
    MONGO_USERNAME,
    MONGO_PASSWORD
}