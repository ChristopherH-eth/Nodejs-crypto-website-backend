/**
 * @file logger.js
 * @author 0xChristopher
 * @brief 
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
        const currentDate = new Date()
        const options = {hours: "long", weekday: "long", year: "numeric", month: "short", day: "numeric"};
        const time = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`

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