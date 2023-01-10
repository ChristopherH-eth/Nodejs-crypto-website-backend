import supertest from "supertest"
import { app } from "../../src/server.js"
import { connectToDBAndListen, database } from "../../src/database.js"
import { TEST_ENDPOINTS, URLS } from "../../src/utils/config.js"

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
     * @brief Tests the /all/count/ endpoint
     */
    describe("#getCryptoCount", function()
    {
        it("Should count the number of cryptocurrency documents in the database", (done) => {
            supertest(app)
                .get(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoCount}`)
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
                .get(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoById}&cryptoId=63bd7f509f05079788e8750f`)
                .expect(200)
                .expect(/"id":1/, done)
        })

        it("Should return not found", (done) => {
            supertest(app)
                .get(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoById}&cryptoId=111111111111111111111111`)
                .expect(404, done)
        })

        it("Should return bad request when an invalid id is provided", (done) => {
            supertest(app)
                .get(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoById}&cryptoId=1`)
                .expect(400, done)
        })

        it("Should return bad request when no id is provided", (done) => {
            supertest(app)
                .get(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoById}`)
                .expect(400, done)
        })
    })

    describe("#updateCryptoById", function() 
    {
        it("Should update a cryptocurrency from the database by id", (done) => {
            supertest(app)
                .put(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoById}&cryptoId=63bd7f509f05079788e8750f`)
                .send({name: "TestCoin"})
                .expect(200)
                .end(() => {
                    supertest(app)
                        .get(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoById}&cryptoId=63bd7f509f05079788e8750f`)
                        .expect(200)
                        .expect(/"name":"TestCoin"/, done)
            })
        })

        it("Should return bad request when no id is provided", (done) => {
            supertest(app)
                .put(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoById}`)
                .send({name: "FailCoin"})
                .expect(400, done)
        })
    })

    describe("#deleteCryptoById", function() 
    {
        it("Should delete a cryptocurrency from the database by id", (done) => {
            supertest(app)
                .delete(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoById}&cryptoId=63bd7f509f05079788e8750f`)
                .expect(200, done)
        })

        it("Should return not found", (done) => {
            supertest(app)
                .delete(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoById}&cryptoId=111111111111111111111111`)
                .expect(404, done)
        })

        it("Should return bad request when an invalid id is provided", (done) => {
            supertest(app)
                .delete(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoById}&cryptoId=1`)
                .expect(400, done)
        })

        it("Should return bad request when no id is provided", (done) => {
            supertest(app)
                .delete(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoById}`)
                .expect(400, done)
        })
    })
})