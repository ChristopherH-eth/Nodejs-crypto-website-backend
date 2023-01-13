import express from "express"
import { ENDPOINTS, TEST_ENDPOINTS } from "../utils/config.js"
import CryptoController from "../controllers/crypto-controller.js"
import MetadataController from "../controllers/metadata-controller.js"

/**
 * @file crypto-route.js
 * @author 0xChristopher
 * @brief This file contains the HTTP request routes for production and testing endpoints.
 */

const router = express.Router()                                         // Express router object

// Production API Routes -- CryptoController
router.route(ENDPOINTS.addCryptos)
    .post(CryptoController.apiPostCryptos)                              // POST new cryptos route
router.route(ENDPOINTS.allCryptos)
    .get(CryptoController.apiGetCryptos)                                // GET all crypto objects route
router.route(ENDPOINTS.cryptoCount)
    .get(CryptoController.apiGetCryptoCount)                            // GET total count route
router.route(ENDPOINTS.cryptosByPage)
    .get(CryptoController.apiGetCryptosByPage)                          // GET page and limit route
router.route(ENDPOINTS.cryptoById)
    .get(CryptoController.apiGetCryptoById)                             // GET by id route
    .put(CryptoController.apiUpdateCryptoById)                          // PUT by id route
    .delete(CryptoController.apiDeleteCryptoById)                       // DELETE by id route

// Production API Routes -- MetadataController
router.route(ENDPOINTS.addMetadata)
    .post(MetadataController.apiPostMetas)                              // POST new metadata route
router.route(ENDPOINTS.metadataByPage)
    .get(MetadataController.apiGetMetasByPage)                          // GET metadata by crypto id

// Test Environment API Routes -- CryptoController
router.route(TEST_ENDPOINTS.addCryptos)
    .post(CryptoController.apiPostCryptos)
router.route(TEST_ENDPOINTS.allCryptos)
    .get(CryptoController.apiGetCryptos)
router.route(TEST_ENDPOINTS.cryptoCount)
    .get(CryptoController.apiGetCryptoCount)
router.route(TEST_ENDPOINTS.cryptosByPage)
    .get(CryptoController.apiGetCryptosByPage)
router.route(TEST_ENDPOINTS.cryptoById)
    .get(CryptoController.apiGetCryptoById)
    .put(CryptoController.apiUpdateCryptoById)
    .delete(CryptoController.apiDeleteCryptoById)

export default router