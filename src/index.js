import app from "./server.js"
import mongodb from "mongodb"
import { MONGO_PASSWORD, MONGO_USERNAME } from "../config.js"
// import CryptoDAO from "./dao/cryptoDAO.js"

const MongoClient = mongodb.MongoClient
const mongoUsername = MONGO_USERNAME
const mongoPassword = MONGO_PASSWORD
const uri = `mongodb+srv://${mongoUsername}:${mongoPassword}@cluster0.2tcgcpm.mongodb.net/
    ?retryWrites=true&w=majority`

const port = 8000

MongoClient.connect(
    uri,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
        useNewUrlParser: true
    })
    .catch(err => {
        console.error(err.stack)
        process.exit(1)
    })
    .then(async () => {
        app.listen(port, () => {
            console.log(`Web server listening on port ${port}`)
        })
    })