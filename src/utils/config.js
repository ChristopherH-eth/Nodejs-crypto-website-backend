import * as dotenv from "dotenv"

/**
 * @file config.js
 * @author 0xChristopher
 * @brief This file handles the exporting of environment variables and others that regularly occur throughout
 *      the server.
 */

dotenv.config()

// Environment variables
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
const COINMARKETCAP_URL = process.env.COINMARKETCAP_URL
const MONGO_USERNAME = process.env.MONGO_USERNAME
const MONGO_PASSWORD = process.env.MONGO_PASSWORD
const TOKEN_KEY = process.env.TOKEN_KEY

// Base URL and API versions
const URLS = {
    apiV1: "/api/v1"
}

// API Endpoints
const ENDPOINTS = {
    addCryptos: "/new/",
    addMetadata: "/new/metadata/",
    allCryptos: "/all/",
    cryptoCount: "/all/count/",
    cryptosByPage: "/pages/",
    metadataById: "/metadata/",
    cryptoById: "/cryptocurrencies/",
    registerUser: "/register/",
    loginUser: "/login/",
    cookies: "/cookies/"
}

// API Test Endpoints
const TEST_ENDPOINTS = {
    addCryptos: `${ENDPOINTS.addCryptos}?test=true`,
    addMetadata: `${ENDPOINTS.addMetadata}?test=true`,
    allCryptos: `${ENDPOINTS.allCryptos}?test=true`,
    cryptoCount: `${ENDPOINTS.cryptoCount}?test=true`,
    cryptosByPage: `${ENDPOINTS.cryptosByPage}?test=true`,
    metadataById: `${ENDPOINTS.metadataById}?test=true`,
    cryptoById: `${ENDPOINTS.cryptoById}?test=true`,
    registerUser: `${ENDPOINTS.registerUser}?test=true`,
    loginUser: `${ENDPOINTS.loginUser}?test=true`,
    cookies: `${ENDPOINTS.cookies}?test=true`
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
    TEST_ENDPOINTS,
    COINMARKETCAP_API_KEY, 
    COINMARKETCAP_URL,
    MONGO_USERNAME,
    MONGO_PASSWORD,
    TOKEN_KEY
}