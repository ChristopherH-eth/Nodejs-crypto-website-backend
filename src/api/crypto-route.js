import express from "express"
import { CryptoController, cryptoData } from "./crypto-controller.js"

const router = express.Router()

router.route("/update").get(CryptoController.apiUpdateDB)
router.route("/").get((req, res) => res.send(cryptoData))

export default router