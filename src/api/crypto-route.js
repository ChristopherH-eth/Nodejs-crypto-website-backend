import express from "express"
import CryptoController from "./crypto-controller.js"

/**
 * @file crypto-route.js
 * @author 0xChristopher
 * @brief 
 */

const router = express.Router()             // Express router object

router.route("/new").post(CryptoController.apiPostCryptos)
router.route("/update").put(CryptoController.apiUpdateCryptos)
router.route("/crypto/:id")
    .get(CryptoController.apiGetCrypto)
    .delete(CryptoController.apiDeleteCrypto)

export default router