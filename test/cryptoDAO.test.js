import { assert } from "chai"
import supertest from "supertest"
import mongodb from "mongodb"
import { injectDB } from "../src/database.js"
import { MONGO_PASSWORD, MONGO_USERNAME } from "../src/utils/config.js"
import { URL } from "../src/utils/config.js"
import Logger from "../src/utils/logger.js"

const MongoClient = mongodb.MongoClient                                 // MongoDB client object
const mongoUsername = MONGO_USERNAME                                    // MongoDB username env variable
const mongoPassword = MONGO_PASSWORD                                    // MongoDB password env variable
const uri = `mongodb+srv://${mongoUsername}:${mongoPassword}`
    + `@cluster0.2tcgcpm.mongodb.net/?retryWrites=true&w=majority`      // Database connection URI

describe("cryptoDAO", function() {
    before(async () => {
        // Connect to MongoDB
        MongoClient.connect(
            uri,
            {
                maxPoolSize: 50,
                wtimeoutMS: 2500,
                useNewUrlParser: true
            })
            .catch((err) => {
                Logger.error(err.stack)
                process.exit(1)
            })
            .then(async (client) => {
                injectDB(client)
            })
    })

    describe("#getCryptoById", function() {
        it("Should get a cryptocurrency from the database by id", async (done) => {
            supertest(URL)
                .get("6395147b70996576de8fd974")
                .expect((res) => {
                    assert.equal(res.body.id, 1)
                }, done())
        })
    })
})