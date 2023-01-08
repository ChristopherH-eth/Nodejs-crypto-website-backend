import supertest from "supertest"
import { assert, expect } from "chai"
import { app } from "../../src/server.js"
import { connectToDBAndListen, database } from "../../src/database.js"
import { ENDPOINTS, TEST_ENDPOINTS, URLS } from "../../src/utils/config.js"

/**
 * @file cryptoAPI.test.js
 * @author 0xChristopher
 * @brief This file performs an integration test of the crypto API.
 */

describe("cryptoAPI", function() 
{
    before(async () => {
        // Connect to MongoDB and start listening for incoming requests
        await connectToDBAndListen()

        const cursor = await database.collection("cryptocurrencies").find({})
        const cryptos = await cursor.toArray()

        await database.collection("test_cryptocurrencies").insertMany(cryptos)
    })

    after(async () => {
        // Drop test database upon test completion
        await database.collection("test_cryptocurrencies").drop()
    })

    /**
     * @brief Tests an undefined API route; this test should always fail
     */
    describe("#illegalRoutes", function()
    {
        it("Should default unspecified routes to 404 error", (done) => {
            supertest(app)
                .get(`${URLS.apiV1}/routeShouldFail`)
                .expect(404, done)
        })
    })

    /**
     * @brief Tests the /all endpoint
     */
    describe("#getCryptoCount", function()
    {
        it("Should count the number of cryptocurrency documents in the database", (done) => {
            supertest(app)
                .get(`${URLS.apiV1}${ENDPOINTS.cryptoCount}`)
                .expect(200, done)
        })
    })

    /**
     * @brief Tests the /cryptocurrencies/ endpoint
     */
    describe("#getCryptoById", function() 
    {
        it("Should get a cryptocurrency from the database by id", (done) => {
            supertest(app)
                .get(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoById}&cryptoId=6395147b70996576de8fd974`)
                .expect(200)
                .expect(/"id":1/, done)
        })

        it("Should return not found", (done) => {
            supertest(app)
                .get(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoById}&cryptoId=111111111111111111111111`)
                .expect(404, done)
        })
    })
})