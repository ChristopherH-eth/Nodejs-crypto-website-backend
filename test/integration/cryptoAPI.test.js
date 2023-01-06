import supertest from "supertest"
import { assert, expect } from "chai"
import { app } from "../../src/server.js"
import { connectToDBAndListen } from "../../src/database.js"
import { URLS } from "../../src/utils/config.js"

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
    })

    /**
     * @brief Tests the /all endpoint
     */
    describe("#getCryptoCount", function()
    {
        it("Should count the number of cryptocurrency documents in the database", (done) => {
            supertest(app)
                .get(`${URLS.apiV1}/all`)
                .expect(200, done)
        })
    })

    /**
     * @brief Tests the /:cryptoId endpoint
     */
    describe("#getCryptoById", function() 
    {
        it("Should get a cryptocurrency from the database by id", (done) => {
            supertest(app)
                .get(`${URLS.apiV1}/6395147b70996576de8fd974`)
                .expect(200)
                .expect(/"id":1/, done)
        })

        it("Should return not found", (done) => {
            supertest(app)
                .get(`${URLS.apiV1}/111111111111111111111111`)
                .expect(404, done)
        })
    })
})