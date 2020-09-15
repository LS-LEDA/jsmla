/*
Moodle Web Log Analytics Tool from Moodle Standard Logs
Copyright (c) 2020 Source code, Daniel Amo
Released under the MIT License
*/

/** Class for internationalization */
class I18N
{

    /**
     * Create a translation string service.
     * @constructor 
     * @param {JSON} i18nConfig - The default configuration value.
     */
    constructor(i18nConfig)
    {
        this._lang = i18Config.lang;
        this._keys = i18Config.keys;
    }

    str(key)
    {
        //return 
    }
}