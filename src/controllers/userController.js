import UserDAO from "../models/userDAO.js"
import Logger from "../utils/logger.js"
import { responseHandler } from "../utils/helpers.js"

/**
 * @file user-controller.js
 * @author 0xChristopher
 * @brief This file is responsible for directing all user related API calls to the correct model
 *      for handling.
 */

class UserController
{
    /**
     * @brief The apiRegisterUser() function handles incoming requests to register new users.
     * @param req Incoming request
     * @param res Outgoing response
     */
    static async apiRegisterUser(req, res, next)
    {
        try
        {
            const testFlag = req.query.test                                 // Test flag
            const {firstName, lastName, email, password} = req.body         // User credentials/information

            // Check for required parameters
            if (!(firstName && lastName && email && password))
            {
                res.status(400).json({error: "Missing required parameters"})

                return
            }

            // Attempt to register a user
            const userResponse = await UserDAO.registerUser(
                firstName, lastName, email.toLowerCase(), password, testFlag
            )

            // Handle error responses
            if (!await responseHandler(res, userResponse))
                res.status(201).json(userResponse)
        }
        catch (e)
        {
            Logger.error(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }

    /**
     * @brief The apiLoginUser() function handles incoming requests to login existing users.
     * @param req Incoming request
     * @param res Outgoing response
     */
    static async apiLoginUser(req, res, next)
    {
        try
        {
            const testFlag = req.query.test                             // Test flag
            const {email, password} = req.body                          // User email and password

            // Check for required parameters
            if (!(email && password))
            {
                res.status(400).json({error: "Missing required parameters"})

                return
            }

            // Attempt to login a user
            const userResponse = await UserDAO.loginUser(email, password, testFlag)

            // Handle error responses
            if (!await responseHandler(res, userResponse))
            {
                // Create user session
                req.session.user = userResponse.token

                // Set user cookie
                res.status(200).cookie("user", req.session.user).json({
                    data: userResponse.response, 
                    firstName: userResponse.user
                })
            }
        }
        catch (e)
        {
            Logger.error(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }

    /**
     * @brief The apiClearCookies() function ends the current user's session and clears their cookies.
     * @param req Incoming request
     * @param res Outgoing response
     */
    static async apiClearCookies(req, res, next)
    {
        try
        {
            const testFlag = req.query.test                             // Test flag

            if (testFlag)
                Logger.test("Logging out user and ending session: " + JSON.stringify(req.headers.cookie))
            else
                Logger.info("Logging out user and ending session: " + JSON.stringify(req.headers.cookie))

            // End session and clear cookie in user's browser
            req.session = null
            res.clearCookie("user").json({message: "Cookie cleared"})
        }
        catch (e)
        {
            Logger.error(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }
}

export default UserController