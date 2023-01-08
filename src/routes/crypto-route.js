import express from "express"
import { ENDPOINTS, TEST_ENDPOINTS } from "../utils/config.js"
import CryptoController from "../controllers/crypto-controller.js"

/**
 * @file crypto-route.js
 * @author 0xChristopher
 * @brief This file contains the HTTP request routes for cryptocurrency objects.
 */

const router = express.Router()                                         // Express router object

// Production API Routes
router.route(ENDPOINTS.cryptos)
    .post(CryptoController.apiPostCryptos)                              // POST new cryptos route
router.route(ENDPOINTS.metas)
    .post(CryptoController.apiPostMetas)                                // POST new metadata route
router.route(ENDPOINTS.cryptoCount)
    .get(CryptoController.apiGetCryptoCount)                            // GET total count route
router.route(ENDPOINTS.cryptosByPage)
    .get(CryptoController.apiGetCryptosByPage)                          // GET page and limit route
router.route(ENDPOINTS.metasByPage)
    .get(CryptoController.apiGetMetasByPage)                            // GET metadata by crypto id
router.route(ENDPOINTS.cryptoById)
    .get(CryptoController.apiGetCryptoById)                             // GET by id route
    .put(CryptoController.apiUpdateCrypto)                              // PUT route
    .delete(CryptoController.apiDeleteCrypto)                           // DELETE route

// Test Environment API Routes
router.route(TEST_ENDPOINTS.cryptoById)
    .get(CryptoController.apiGetCryptoById)

export default router