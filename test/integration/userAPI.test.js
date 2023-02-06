import supertest from "supertest"
import { app } from "../../src/server.js"
import { connectToDBAndListen, database } from "../../src/database.js"
import { TEST_ENDPOINTS, URLS } from "../../src/utils/config.js"
import { expect } from "chai"

/**
 * @file userAPI.test.js
 * @author 0xChristopher
 * @brief This file performs an integration test of the crypto API. Supertest is used to test against the
 *      NodeJS/ExpressJS server instance, while Mocha is used to handle each test, and Chai is used to handle
 *      assertions and expectations when necessary.
 */

describe("User Collection", function()
{
    const collection = "users"                                      // Production collection
    const testCollection = "test_users"                             // Test collection
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
     * @brief Tests the /register/ endpoint POST method
     */
    describe("#registerUser", function() 
    {
        it("Should register a new user and add them to the database", (done) => {
            supertest(app)
                .post(`${URLS.apiV1}${TEST_ENDPOINTS.registerUser}`)
                .send({firstName: "John", lastName: "Doe", email: "jdoe@test.com", password: "132435"})
                .expect(201)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end((err) => {
                    if (err)
                        throw err

                    done()
                })
        })

        it("Should fail when missing required fields (first name)", (done) => {
            supertest(app)
                .post(`${URLS.apiV1}${TEST_ENDPOINTS.registerUser}`)
                .send({lastName: "Doe", email: "jdoe@test.com", password: "132435"})
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end((err) => {
                    if (err)
                        throw err

                    done()
                })
        })

        it("Should fail when missing required fields (last name)", (done) => {
            supertest(app)
                .post(`${URLS.apiV1}${TEST_ENDPOINTS.registerUser}`)
                .send({firstName: "John", email: "jdoe@test.com", password: "132435"})
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end((err) => {
                    if (err)
                        throw err

                    done()
                })
        })

        it("Should fail when missing required fields (email)", (done) => {
            supertest(app)
                .post(`${URLS.apiV1}${TEST_ENDPOINTS.registerUser}`)
                .send({firstName: "John", lastName: "Doe", password: "132435"})
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end((err) => {
                    if (err)
                        throw err

                    done()
                })
        })

        it("Should fail when missing required fields (password)", (done) => {
            supertest(app)
                .post(`${URLS.apiV1}${TEST_ENDPOINTS.registerUser}`)
                .send({firstName: "John", lastName: "Doe", email: "jdoe@test.com"})
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
     * @brief Tests the /login/ endpoint POST method
     */
    describe("#loginUser", function() 
    {
        it("Should log in a user", (done) => {
            supertest(app)
                .post(`${URLS.apiV1}${TEST_ENDPOINTS.loginUser}`)
                .send({email: "jdoe@test.com", password: "132435"})
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end((err, res) => {
                    expect(res.body.firstName).to.equal("John")

                    if (err)
                        throw err

                    // Logout the user
                    supertest(app)
                        .get(`${URLS.apiV1}${TEST_ENDPOINTS.cookies}`)
                        .expect(200)
                        .expect("Content-Type", "application/json; charset=utf-8")
                        .end((err, res) => {
                            expect(res.body.message).to.equal("Cookie cleared")

                            if (err)
                                throw err

                            done()
                        })
                })
        })

        it("Should fail when missing required fields (email)", (done) => {
            supertest(app)
                .post(`${URLS.apiV1}${TEST_ENDPOINTS.loginUser}`)
                .send({password: "132435"})
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end((err) => {
                    if (err)
                        throw err

                    done()
                })
        })

        it("Should fail when missing required fields (password)", (done) => {
            supertest(app)
                .post(`${URLS.apiV1}${TEST_ENDPOINTS.loginUser}`)
                .send({email: "jdoe@test.com"})
                .expect(400)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end((err) => {
                    if (err)
                        throw err

                    done()
                })
        })
    })
})