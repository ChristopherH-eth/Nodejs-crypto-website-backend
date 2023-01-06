import * as dotenv from "dotenv"

/**
 * @file config.js
 * @author 0xChristopher
 * @brief This file handles the exporting of environment variables.
 */

dotenv.config()

// Environment variables
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
const COINMARKETCAP_URL = process.env.COINMARKETCAP_URL
const MONGO_USERNAME = process.env.MONGO_USERNAME
const MONGO_PASSWORD = process.env.MONGO_PASSWORD

// Base URL and API versions
const URLS = {
    apiV1: "/api/v1/crypto"
}

// API endpoints
const ENDPOINTS = {
    cryptos: "/new",
    metas: "/new/meta",
    cryptoCount: "/all",
    cryptosByPage: "/pages/:page/:limit",
    metasByPage: "/meta/",
    cryptoById: "/:cryptoId"
}

// Update intervals
const UPDATE = {
    hour: 3600000,                      // 1 hour
    day: 86400000                       // 1 day
}

export {
    UPDATE,
    URLS,
    ENDPOINTS,
    COINMARKETCAP_API_KEY, 
    COINMARKETCAP_URL,
    MONGO_USERNAME,
    MONGO_PASSWORD
}