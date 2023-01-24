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
            const testFlag = req.query.test
            const {firstName, lastName, email, password} = req.body

            // Check for required parameters
            if (!(firstName && lastName && email && password))
            {
                res.status(400).json({error: "Missing required parameters"})

                return
            }

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
            const testFlag = req.query.test
            const {email, password} = req.body

            // Check for required parameters
            if (!(email, password))
            {
                res.status(400).json({error: "Missing required parameters"})

                return
            }

            const userResponse = await UserDAO.loginUser(email, password, testFlag)

            // Handle error responses
            if (!await responseHandler(res, userResponse))
                res.status(200).json(userResponse)
        }
        catch (e)
        {
            Logger.error(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }
}

export default UserController