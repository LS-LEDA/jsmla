/*
Moodle Web Log Analytics Tool from Moodle Standard Logs
Copyright (c) 2020 Source code, Daniel Amo
Released under the MIT License
*/

/** Class Browser Storage. */
class BrowserStorage
{
    
    /**
     * Create a modal msg popup window.
     * @constructor 
     * @param {JSON} mpConfig - The default configuration value.
     */
    constructor(stgConfig)
    {
    }

    /**
     * Load a saved Dashboard.
     * @param {object} The config value.
     * @return {object} The widgets saved.
     */
    load(loadConfig)
    {
        this._widgets = JSON.parse(localStorage.getItem(loadConfig.name));
    }

    /**
     * Save the widgets.
     * @param {object} The config value.
     */
    save(saveConfig)
    {
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        let json = JSON.stringify(saveConfig.data),
            blob = new Blob([json], {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = saveConfig.fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }

    saveIndex()
    {
        
    }

}