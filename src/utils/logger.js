/**
 * @file logger.js
 * @author 0xChristopher
 * @brief 
 */

class Logger
{
    /**
     * @brief The info function takes in a set of parameters and logs them to the console.
     * @param {...any} params The information to be logged
     */
    static info = (...params) => {
        console.log(...params)
    }

    /**
     * @brief The error function takes in a set of parameters and logs them as an error to the console.
     * @param {...any} params The error to be logged
     */
    static error = (...params) => {
        console.error(...params)
    }
}

export default Logger