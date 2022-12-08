import express from "express"
import CryptoController from "../controllers/crypto-controller.js"

/**
 * @file crypto-route.js
 * @author 0xChristopher
 * @brief 
 */

const router = express.Router()             // Express router object

router.route("/new").post(CryptoController.apiPostCryptos)
router.route("/update").put(CryptoController.apiUpdateCryptos)
router.route("/all").get(CryptoController.apiGetCryptos)
router.route("/:id")
    .get(CryptoController.apiGetCryptoById)
    .delete(CryptoController.apiDeleteCrypto)

export default router