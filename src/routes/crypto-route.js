import express from "express"
import CryptoController from "../controllers/crypto-controller.js"

/**
 * @file crypto-route.js
 * @author 0xChristopher
 * @brief This file contains the HTTP request routes for cryptocurrency objects.
 */

const router = express.Router()                                                 // Express router object

router.route("/new").post(CryptoController.apiPostCryptos)                      // POST new cryptos route
router.route("/new/meta").post(CryptoController.apiPostMetas)                   // POST new metadata route
router.route("/all").get(CryptoController.apiGetCryptoCount)                    // GET total count route
router.route("/pages/:page/:limit").get(CryptoController.apiGetCryptosByPage)   // GET page and limit route
router.route("/:cryptoId")
    .get(CryptoController.apiGetCryptoById)                                     // GET by id route
    .put(CryptoController.apiUpdateCrypto)                                      // PUT route
    .delete(CryptoController.apiDeleteCrypto)                                   // DELETE route

export default router