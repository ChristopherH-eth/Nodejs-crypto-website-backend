import supertest from "supertest"
import { expect } from "chai"
import { app } from "../../src/server.js"
import { connectToDBAndListen, database } from "../../src/database.js"
import { TEST_ENDPOINTS, URLS } from "../../src/utils/config.js"

/**
 * @file metadataAPI.test.js
 * @author 0xChristopher
 * @brief This file performs an integration test of the crypto API. Supertest is used to test against the
 *      NodeJS/ExpressJS server instance, while Mocha is used to handle each test, and Chai is used to handle
 *      assertions and expectations when necessary.
 */

describe("Metadata Collection", function()
{
    const collection = "metadata"                                   // Production collection
    const testCollection = "test_metadata"                          // Test collection
    let testObjectId, testId

    before(async () => {
        // Check if we're already connected to the database
        if (!database)
        {
            // Connect to MongoDB and start listening for incoming requests
            await connectToDBAndListen()
        }

        // Duplicate production database for testing
        const cursor = await database.collection(collection).find({})
        const cryptos = await cursor.toArray()
        testObjectId = cryptos[0]._id.toString()
        testId = cryptos[0].id

        await database.collection(testCollection).insertMany(cryptos)
    })

    after(async () => {
        // Drop test database upon test completion
        await database.collection(testCollection).drop()
    })

    /**
     * @brief Tests the /new/metadata/ endpoint POST method
     */
    describe("#addMetadata", function()
    {
        it("Should successfully add a new metadata object to the database", (done) => {
            supertest(app)
                .post(`${URLS.apiV1}${TEST_ENDPOINTS.addMetadata}`)
                .send({id: 987654})
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end((err) => {
                    if (err)
                        throw err

                    supertest(app)
                        .get(`${URLS.apiV1}${TEST_ENDPOINTS.metadataById}&cryptos=987654`)
                        .expect(200)
                        .expect("Content-Type", "application/json; charset=utf-8")
                        .end((err, res) => {
                            expect(res.body[0].id).to.equal(987654)

                            if (err)
                                throw err

                            done()
                        })
                })
        })

        it("Should return bad request if no id is provided", (done) => {
            supertest(app)
                .post(`${URLS.apiV1}${TEST_ENDPOINTS.addMetadata}`)
                .send({name: "TestData"})
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8", done)
        })
    })

    /**
     * @brief Tests the /metadata/ endpoint GET method
     */
    describe("#getMetadataById", function()
    {
        it("Should return array of metadata objects", (done) => {
            supertest(app)
                .get(`${URLS.apiV1}${TEST_ENDPOINTS.metadataById}&cryptos=1,1027`)
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end((err, res) => {
                    expect(res.body[0].id).to.equal(1)
                    expect(res.body[1].id).to.equal(1027)

                    if (err)
                        throw err

                    done()
                })
        })

        it("Should return not found if an invalid id is provided", (done) => {
            supertest(app)
                .get(`${URLS.apiV1}${TEST_ENDPOINTS.metadataById}&cryptos=0`)
                .expect(404)
                .expect("Content-Type", "application/json; charset=utf-8", done)
        })

        it("Should return bad request if an no id is provided", (done) => {
            supertest(app)
                .get(`${URLS.apiV1}${TEST_ENDPOINTS.metadataById}`)
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8", done)
        })
    })

    /**
     * @brief Tests the /metadata/ endpoint PUT method
     */
    describe("#updateMetadataById", function()
    {
        it("Should successfully update a metadata object in the database", (done) => {
            supertest(app)
                .put(`${URLS.apiV1}${TEST_ENDPOINTS.metadataById}`)
                .send({id: 987654, logo: "TestLogo"})
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end((err) => {
                    if (err)
                        throw err

                    supertest(app)
                        .get(`${URLS.apiV1}${TEST_ENDPOINTS.metadataById}&cryptos=987654`)
                        .expect(200)
                        .expect("Content-Type", "application/json; charset=utf-8")
                        .end((err, res) => {
                            expect(res.body[0].id).to.equal(987654)
                            expect(res.body[0].logo).to.equal("TestLogo")

                            if (err)
                                throw err

                            done()
                        })
                })
        })

        it("Should return bad request if no id is provided", (done) => {
            supertest(app)
                .put(`${URLS.apiV1}${TEST_ENDPOINTS.metadataById}`)
                .send({name: "TestData"})
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8", done)
        })
    })

    /**
     * @brief Tests the /metadata/ endpoint DELETE method
     */
    describe("deleteMetadataById", function()
    {
        it("Should delete a cryptocurrency from the database by id", (done) => {
            supertest(app)
                .delete(`${URLS.apiV1}${TEST_ENDPOINTS.metadataById}&metadataId=1`)
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8", done)
        })
    })
})