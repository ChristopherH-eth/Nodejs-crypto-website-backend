/**
 * @file helpers.js
 * @author 0xChristopher
 * @brief This file is responsible for providing helper functions used throughout the application.
 */

/**
 * @brief The responseHandler() function checks data from a database operation and checks for error responses
 *      to handle.
 * @param res Outgoing response
 * @param data The data to be checked
 * @return Returns 'true' if an error response was handled
 */
async function responseHandler(res, data)
{
    // Check if we received a valid object
    if (!data)
    {
        res.status(404).json({error: "Not found"})
        
        return true
    }

    // Check if we received an error response
    const {error} = data

    if (error)
    {
        res.status(400).json({error})

        return true
    }
}

export { responseHandler }