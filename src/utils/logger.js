/**
 * @file logger.js
 * @author 0xChristopher
 * @brief This file is responsible for the Logger class, which is used to provide time stamped information
 *      for use in debugging and testing.
 */

class Logger
{
    /**
     * @brief The getDate() function creates a string consisting of the current date and time for use with
     *      the Logger.
     * @returns Returns the date/time string
     */
    static getDate()
    {
        const currentDate = new Date()                                      // Gets the current date/time
        const options = {hours: "long", weekday: "long",                    // Date/time display options
            year: "numeric", month: "short", day: "numeric"};
        const time = `${currentDate.getHours()}:`                           // Date/time display format
            + `${currentDate.getMinutes()}:${currentDate.getSeconds()}`

        return `${time} ${currentDate.toLocaleDateString("en-us", options)}`
    }

    /**
     * @brief The info function takes in a set of parameters and logs them to the console.
     * @param {...any} params The information to be logged
     */
    static info = (...params) => {
        const date = `[${this.getDate()} INFO]`
        console.log(date, ...params)
    }

    /**
     * @brief The warn function takes in a set of parameters and logs them to the console.
     * @param {...any} params The information to be logged
     */
    static warn = (...params) => {
        const date = `[${this.getDate()} WARN]`
        console.log(date, ...params)
    }

    /**
     * @brief The error function takes in a set of parameters and logs them as an error to the console.
     * @param {...any} params The error to be logged
     */
    static error = (...params) => {
        const date = `[${this.getDate()} ERROR]`
        console.error(...params)
    }
}

export default Logger