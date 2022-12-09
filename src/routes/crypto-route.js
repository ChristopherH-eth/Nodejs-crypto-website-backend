import express from "express"
import CryptoController from "../controllers/crypto-controller.js"

/**
 * @file crypto-route.js
 * @author 0xChristopher
 * @brief This file contains the HTTP request routes for cryptocurrency objects.
 */

const router = express.Router()                                         // Express router object

router.route("/new").post(CryptoController.apiPostCryptos)              // POST route
router.route("/all").get(CryptoController.apiGetCryptos)                // GET all route
router.route("/:cryptoId")
    .get(CryptoController.apiGetCryptoById)                             // GET by id route
    .put(CryptoController.apiUpdateCrypto)                              // PUT route
    .delete(CryptoController.apiDeleteCrypto)                           // DELETE route

export default router