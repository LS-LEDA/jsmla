/*
Moodle Web Log Analytics Tool from Moodle Standard Logs
Copyright (c) 2020 Source code, Daniel Amo
Released under the MIT License
*/

const ERROR_EXCEPTION_BREAK = 0;
const ERROR_EXCEPTION_FILE  = 1;
const ERROR_EXCEPTION_JSON = 2;

/** Class representing an error. */
class Error
{

    /**
     * Create an error.
     * @param {JSON} errConfig - The default configuration value.
     */
    constructor(errConfig)
    {
        this._errno = errConfig.errno;
        this._msg = errConfig.msg;
    }

    /**
     * Get the message value.
     * @return {string} The msg value.
     */
    get msg()
    {
        return this._msg;
    }
    
    /**
     * Get the error number value.
     * @return {number} The errno value.
     */
    get errno()
    {
        return this._errno;
    }

    /**
     * Get the full error object value.
     * @return {JSON} The full error object value.
     */
    get error() {
        return {errno: this._errno, msg: this._msg};
    }

    /**
     * Set the message.
     * @param {string} msg - The message string value.
     */
    set msg(msg)
    {
        this._msg = msg;
    }

    /**
     * Set the error number.
     * @param {number} errno - The error number value.
     */
    set errno(errno)
    {
        this._errno = errno;
    }

    /**
     * Get the full error object value.
     * @param {JSON} errObj - The full error object value.
     */
    set error(errObj)
    {
        this._errno = errObj.errno;
        this._msg = errObj.msg;
    }
}