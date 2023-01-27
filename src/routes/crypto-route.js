import express from "express"
import { ENDPOINTS } from "../utils/config.js"
import CryptoController from "../controllers/crypto-controller.js"
import MetadataController from "../controllers/metadata-controller.js"
import UserController from "../controllers/user-controller.js"

/**
 * @file crypto-route.js
 * @author 0xChristopher
 * @brief This file contains the HTTP request routes for production and testing endpoints.
 */

const router = express.Router()                                         // Express router object

// API Routes -- CryptoController
router.route(ENDPOINTS.addCryptos)
    .post(CryptoController.apiPostCryptos)                              // POST new cryptos route
router.route(ENDPOINTS.allCryptos)
    .get(CryptoController.apiGetCryptos)                                // GET all crypto objects route
router.route(ENDPOINTS.cryptoCount)
    .get(CryptoController.apiGetCryptoCount)                            // GET total crypto count route
router.route(ENDPOINTS.cryptosByPage)
    .get(CryptoController.apiGetCryptosByPage)                          // GET cryptos by page and limit route
router.route(ENDPOINTS.cryptoById)
    .get(CryptoController.apiGetCryptoById)                             // GET crypto by id route
    .put(CryptoController.apiUpdateCryptoById)                          // PUT crypto by id route
    .delete(CryptoController.apiDeleteCryptoById)                       // DELETE crypto by id route

// API Routes -- MetadataController
router.route(ENDPOINTS.addMetadata)
    .post(MetadataController.apiPostMetadata)                           // POST new metadata route
router.route(ENDPOINTS.metadataById)
    .get(MetadataController.apiGetMetadataById)                         // GET metadatas by id route
    .put(MetadataController.apiUpdateMetadataById)                      // PUT metadata by id route
    .delete(MetadataController.apiDeleteMetadataById)                   // DELETE metadata by id route

// API Routes -- UserController
router.route(ENDPOINTS.registerUser)
    .post(UserController.apiRegisterUser)                               // POST user registration
router.route(ENDPOINTS.loginUser)
    .post(UserController.apiLoginUser)                                  // POST user login
router.route(ENDPOINTS.cookies)
    .get(UserController.apiClearCookies)                                // GET cookies

export default router