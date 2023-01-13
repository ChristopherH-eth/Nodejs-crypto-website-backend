import supertest from "supertest"
import { expect } from "chai"
import { app } from "../../src/server.js"
import { connectToDBAndListen, database } from "../../src/database.js"
import { TEST_ENDPOINTS, URLS } from "../../src/utils/config.js"

/**
 * @file cryptoAPI.test.js
 * @author 0xChristopher
 * @brief This file performs an integration test of the crypto API. Supertest is used to test against the
 *      NodeJS/ExpressJS server instance, while Mocha is used to handle each test, and Chai is used to handle
 *      assertions and expectations when necessary.
 */

describe("Cryptocurrencies Collection", function() 
{
    let testObjectId, testId

    before(async () => {
        // Connect to MongoDB and start listening for incoming requests
        await connectToDBAndListen()

        // Duplicate production database for testing
        const cursor = await database.collection("cryptocurrencies").find({})
        const cryptos = await cursor.toArray()
        testObjectId = cryptos[0]._id.toString()
        testId = cryptos[0].id

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
                .expect(404)
                .expect("Content-Type", "application/json; charset=utf-8", done)
        })
    })

    /**
     * @brief Tests the /new/ endpoint POST method
     */
    describe("#addCrypto", function()
    {
        it("Should add a cryptocurrency object to the database", (done) => {
            supertest(app)
                .post(`${URLS.apiV1}${TEST_ENDPOINTS.addCryptos}`)
                .send({id: 987654, name: "TestCrypto", cmc_rank: 9000})
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end((err) => {

                    if (err)
                        throw err

                    supertest(app)
                        .get(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoById}&cryptoId=987654`)
                        .expect(200)
                        .expect("Content-Type", "application/json; charset=utf-8")
                        .end((err, res) => {
                            expect(res.body.name).to.equal("TestCrypto")

                            if (err)
                                throw err

                            done()
                        })
                })
        })

        it("Should fail if no id is provided", (done) => {
            supertest(app)
                .post(`${URLS.apiV1}${TEST_ENDPOINTS.addCryptos}`)
                .send({name: "TestCrypto", cmc_rank: 9000})
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end((err) => {
                    if (err)
                        throw err
                    
                    done()
                })
        })
    })

    /**
     * @brief Tests the /all/ endpoint GET method
     */
    describe("#getCryptos", function()
    {
        it("Should return all cryptocurrency objects in the database", (done) => {
            supertest(app)
                .get(`${URLS.apiV1}${TEST_ENDPOINTS.allCryptos}`)
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end((err, res) => {
                    expect(res.body.length).to.be.above(1000)

                    if (err)
                        throw err

                    done()
                })
        })
    })

    /**
     * @brief Tests the /all/count/ endpoint GET method
     */
    describe("#getCryptoCount", function()
    {
        it("Should count the number of cryptocurrency documents in the database", (done) => {
            supertest(app)
                .get(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoCount}`)
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end((err, res) => {
                    expect(res.body).to.be.above(1000)

                    if (err)
                        throw err

                    done()
                })
        })
    })

    /**
     * @brief Tests the /pages/ endpoint GET method
     */
    describe("#getCryptosByPage", function() 
    {
        it("Should return a given number of cryptocurrency objects for a given page", (done) => {
            supertest(app)
                .get(`${URLS.apiV1}${TEST_ENDPOINTS.cryptosByPage}&limit=100&page=1`)
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end((err, res) => {
                    expect(res.body[1].id).to.equal(1027)

                    if (err)
                        throw err

                    done()
                })
        })

        it("Should return bad request when a limit is not provided", (done) => {
            supertest(app)
                .get(`${URLS.apiV1}${TEST_ENDPOINTS.cryptosByPage}&page=1`)
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8", done)
        })

        it("Should return bad request when a page is not provided", (done) => {
            supertest(app)
                .get(`${URLS.apiV1}${TEST_ENDPOINTS.cryptosByPage}&limit=100`)
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8", done)
        })
    })

    /**
     * @brief Tests the /cryptocurrencies/ endpoint GET method
     */
    describe("#getCryptoById", function() 
    {
        it("Should get a cryptocurrency from the database by ObjectId", (done) => {
            supertest(app)
                .get(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoById}&cryptoId=${testObjectId}`)
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end((err, res) => {
                    expect(res.body._id).to.equal(testObjectId)

                    if (err)
                        throw err

                    done()
                })
        })

        it("Should get a cryptocurrency from the database by Id", (done) => {
            supertest(app)
                .get(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoById}&cryptoId=${testId}`)
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end((err, res) => {
                    expect(res.body.id).to.equal(testId)

                    if (err)
                        throw err

                    done()
                })
        })

        it("Should return not found when an invalid ObjectId is provided", (done) => {
            supertest(app)
                .get(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoById}&cryptoId=111111111111111111111111`)
                .expect(404)
                .expect("Content-Type", "application/json; charset=utf-8", done)
        })

        it("Should return not found when an invalid id is provided", (done) => {
            supertest(app)
                .get(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoById}&cryptoId=91929394`)
                .expect(404)
                .expect("Content-Type", "application/json; charset=utf-8", done)
        })

        it("Should return bad request when no id is provided", (done) => {
            supertest(app)
                .get(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoById}`)
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8", done)
        })
    })

    /**
     * @brief Tests the /cryptocurrencies/ endpoint PUT method
     */
    describe("#updateCryptoById", function() 
    {
        it("Should update a cryptocurrency from the database by id", (done) => {
            supertest(app)
                .put(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoById}&cryptoId=${testObjectId}`)
                .send({id: 1, name: "TestCoin"})
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(() => {
                    supertest(app)
                        .get(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoById}&cryptoId=${testObjectId}`)
                        .expect(200)
                        .expect("Content-Type", "application/json; charset=utf-8")
                        .end((err, res) => {
                            expect(res.body.name).to.equal("TestCoin")

                            if (err)
                                throw err

                            done()
                        })
            })
        })

        it("Should create new document if one doesn't exist", (done) => {
            supertest(app)
                .put(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoById}&cryptoId=222222222222222222222222`)
                .send({id: 123456, name: "TestCoin2"})
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(() => {
                    supertest(app)
                        .get(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoById}&cryptoId=123456`)
                        .expect(200)
                        .expect("Content-Type", "application/json; charset=utf-8")
                        .end((err, res) => {
                            expect(res.body.name).to.equal("TestCoin2")

                            if (err)
                                throw err

                            done()
                        })
                })
        })

        it("Should return bad request when an invalid id is provided", (done) => {
            supertest(app)
                .put(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoById}&cryptoId=1`)
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8", done)
        })

        it("Should return bad request when no id is provided", (done) => {
            supertest(app)
                .put(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoById}`)
                .send({name: "FailCoin"})
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8", done)
        })
    })

    /**
     * @brief Tests the /cryptocurrencies/ endpoint DELETE method
     */
    describe("#deleteCryptoById", function() 
    {
        it("Should delete a cryptocurrency from the database by id", (done) => {
            supertest(app)
                .delete(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoById}&cryptoId=${testObjectId}`)
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8", done)
        })

        it("Should return not found", (done) => {
            supertest(app)
                .delete(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoById}&cryptoId=111111111111111111111111`)
                .expect(404)
                .expect("Content-Type", "application/json; charset=utf-8", done)
        })

        it("Should return bad request when an invalid id is provided", (done) => {
            supertest(app)
                .delete(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoById}&cryptoId=1`)
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8", done)
        })

        it("Should return bad request when no id is provided", (done) => {
            supertest(app)
                .delete(`${URLS.apiV1}${TEST_ENDPOINTS.cryptoById}`)
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8", done)
        })
    })
})

describe("Metadata Collection", function()
{
    let testObjectId, testId

    before(async () => {
        // Duplicate production database for testing
        const cursor = await database.collection("metadata").find({})
        const cryptos = await cursor.toArray()
        testObjectId = cryptos[0]._id.toString()
        testId = cryptos[0].id

        await database.collection("test_metadata").insertMany(cryptos)
    })

    after(async () => {
        // Drop test database upon test completion
        await database.collection("test_metadata").drop()
    })

    describe("#", function()
    {
        it("Should pass", () => {
            // TODO: Setup tests
        })
    })
})