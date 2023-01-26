import jwt from "jsonwebtoken"
import { TOKEN_KEY } from "./config.js"

/**
 * @file auth.js
 * @author 0xChristopher
 * @brief 
 */

/**
 * @brief The verifyToken() function verifies a token sent by the user for authentication.
 * @param req Incoming request
 * @param res Outgoing response
 */
async function verifyToken(req, res, next)
{
    const token = req.body.token || req.query.token || req.headers["x-access-token"]

    // Check if the user has sent a token
    if (!token)
        return res.status(403).send("A token is required for authentication")

    try
    {
        jwt.verify(token, TOKEN_KEY)
    }
    catch (e)
    {
        return {error: e}
    }
}

export { verifyToken }