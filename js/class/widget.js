/** 
* FILE DESCRIPTION: Widget definition 
* @package jsmla 
* @copyright 2020 Daniel Amo * daniel.amo@salle.url.edu 
* @copyright 2020 La Salle Campus Barcelona, Universitat Ramon Llull https://www.salleurl.edu 
* @author Daniel Amo 
* @author Pablo Gómez
* @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later 
*/

const WIDGET_CODE_SNIPPET      = 0;
const WIDGET_TEXT              = 1;

const WIDGET_JS_CSS_LOADING    = 0;
const WIDGET_JS_LOADED         = 1;
const WIDGET_CSS_LOADED        = 2;

/** Class representing a Widget Template. */
class Widget
{

    /**
     * Create a Widget Template.
     * @constructor 
     * @param {object} wtConfig - The default configuration value.
     */
    constructor(index, wtConfig)
    {
        let defaultConfig = {
            mode:WIDGET_TEXT,

            prefix:"widget_",
            delimiter:"%",

            width:250,
            height:250,
            size:1,
            
            /** @type {boolean} Every widget can be visible (by default) or hidden for internal calculus */
            visible:true,

            counter:false,

            field:undefined,
            
            /** @type {string} Sort by 'value' or 'label' */
            sortBy:'value',
            order:'DESC',
            limit:undefined,
            calcFn:{fn:"count", field:undefined},
            filter:undefined,

            callback:"editWidget",

            srcJS:undefined,
            srcCSS:undefined,

            snippet:undefined,

            css:undefined,
            
            /** @type {string} Every widget has a html templating, if not set the default is used */
            html:'\
                <div class="widget" id="%ID%" style="width:%WIDTH%px;height:%HEIGHT%px">\
                    <h2 id="title_%ID%" class="title" onclick="%CALLBACK%(\'%ID%\');">%TITLE%</h2>\
                    <div id="content_%ID%" class="content" style="width:%WIDTH%px;height:%HEIGHT%px">%TEXT_CONTENT%</div>\
                </div>\
            '
        };

        // overwrite default config
        if (undefined !== wtConfig)
        {
            for (let prop in wtConfig)
            {
                defaultConfig[prop] = wtConfig[prop];
            }
        }

        // create private variables for each configuration property
        for (let prop in defaultConfig)
        {
            this["_" + prop] = defaultConfig[prop];
        }

        // widget identificator
        this._id = this._prefix + "" + index;

        // widget index
        this._index = index;

        // data: labels and values
        this.resetLabelsAndValues();

        // evaluations
        this.resetEvals();

        // a widget is loaded when js and css are loaded
        this._loaded = WIDGET_JS_CSS_LOADING;
        
        // import js and css content if needed
        this.loadJS();
        this.loadCSS();
    }

    /**
     * Get the widget calculated function value.
     * @return {string} The calculated function value.
     */
    get calcFn()
    {
        return this._calcFn;
    }

    /**
     * Get the widget data value.
     * @return {object} The data value.
     */
    get data()
    {
        return this._data;
    }

    /**
     * Get the widget html value.
     * @return {string} The html value.
     */
    get evaluatedHTML()
    {
        return this._evaluatedHTML;
    }

    /**
     * Get the widget css value.
     * @return {string} The css value.
     */
    get evaluatedCSS()
    {
        return this._evaluatedCSS;
    }

    /**
     * Get the widget css & html value.
     * @return {string} The css & htmlvalue.
     */
    get evaluatedCSSHTML()
    {
        return this._evaluatedCSS + this._evaluatedHTML;
    }

    /**
     * Get the widget field value.
     * @return {string} The field value.
     */
    get evaluatedSnippet()
    {
        return this._evaluatedSnippet;
    }

    /**
     * Get the widget field value.
     * @return {string} The field value.
     */
    get executedSnippetResult()
    {
        return this._executedSnippetResult;
    }

    /**
     * Get the widget field value.
     * @return {string} The field value.
     */
    get field()
    {
        return this._field;
    }

    /**
     * Get the widget filter value.
     * @return {array|object} The filter value.
     */
    get filter()
    {
        return this._filter;
    }

    /**
     * Get the widget id value.
     * @return {string} The id value.
     */
    get id()
    {
        return this._id;
    }

    /**
     * Get the widget limit value.
     * @return {number} The limit value.
     */
    get limit()
    {
        return this._limit;
    }

    /**
     * Get the widget loaded value.
     * @return {number} The loaded value.
     */
    get loaded()
    {
        return this._loaded;
    }

    /**
     * Get the widget mode value.
     * @return {number} The mode value.
     */
    get mode()
    {
        return this._mode;
    }

    /**
     * Get the widget order value.
     * @return {string} The order value.
     */
    get order()
    {
        return this._order;
    }

    /**
     * Get the widget sortBy value.
     * @return {string} The sortBy value.
     */
    get sortBy()
    {
        return this._sortBy;
    }

    /**
     * Get the widget visible value.
     * @return {object} The visible value.
     */
    get visible()
    {
        return this._visible;
    }

    /**
     * Set the widget visible value.
     */
    set visible(visible)
    {
        this._visible = visible;
    }

    /**
     * Get the widget counter value.
     * @return {object} The counter value.
     */
    get counter()
    {
        return this._counter;
    }

    /**
     * Get the widget counter value.
     */
    set counter(counter)
    {
        this._counter = counter;
    }

    /**
     * Get the widget data value.
     * @param {object} The data value with labels and values properties.
     */
    set data(data)
    {
        this._data = data;
    }

    /**
     * Return the javascript of the widget snippet once replaced tags and evaluated.
     * * @return {string}
     */
    evalAndExecuteSnippet()
    {
        this.evalSnippet();
        return this.executeSnippet();
    }

    /**
     * Return the javascript of the widget HTML once replaced tags.
     */
    evalHTML()
    {
        this._evaluatedHTML = this._html
            .replace(new RegExp(this._delimiter+"ID"+this._delimiter, 'g'), this._id)
            .replace(new RegExp(this._delimiter+"CALLBACK"+this._delimiter, 'g'), this._callback)
            .replace(new RegExp(this._delimiter+"TITLE"+this._delimiter, 'g'), this._title)
            .replace(new RegExp(this._delimiter+"WIDTH"+this._delimiter, 'g'), (this._width)*this._size)
            .replace(new RegExp(this._delimiter+"HEIGHT"+this._delimiter, 'g'), this._height*this._size)
            .replace(new RegExp(this._delimiter+"TEXT_CONTENT"+this._delimiter, 'g'), "")
            .replace(new RegExp(this._delimiter+"TOOLTIP"+this._delimiter, 'g'),this._tooltip);
            
        return this._evaluatedHTML;
    }

    evalCSS()
    {
        this._evaluatedCSS = (undefined !== this._css)?"<style type=\"text/css\">"+this._css+"</style>":"";
    }

    evalCSSHTML()
    {
        this.evalCSS();
        this.evalHTML();
    }

    /**
     * Return the javascript of the widget snippet once replaced tags.
     * * @return {string}
     */
    evalSnippet()
    {
        this._evaluatedSnippet = "";
        if (undefined !== this._snippet)
        {
            this._evaluatedSnippet = this._snippet
                .replace(new RegExp(this._delimiter+"ID"+this._delimiter, 'g'), this._id)
                .replace(new RegExp(this._delimiter+"WIDTH"+this._delimiter, 'g'), this._width*this._size)
                .replace(new RegExp(this._delimiter+"HEIGHT"+this._delimiter, 'g'), this._height*this._size)
                .replace(new RegExp(this._delimiter+"LABELS"+this._delimiter, 'g'), JSON.stringify(this._data.labels))
                .replace(new RegExp(this._delimiter+"VALUES"+this._delimiter, 'g'), JSON.stringify(this._data.values))
                .replace(new RegExp(this._delimiter+"COUNT"+this._delimiter, 'g'), (0<this._data.values.length)?this._data.values.reduce(function (total, num) { return total + num;}):this._data.values);
        }
        return this._evaluatedSnippet;
    }

    /**
     * Return the javascript of the widget snippet once evaluated.
     * * @return {string}
     */
    executeSnippet()
    {
        return this._executedSnippetResult = eval(this._evaluatedSnippet);
    }

    /**
     * Return an exportable object with roperties.
     * * @return {object}
     */
    export()
    {
        let exportData = {};
        for (let prop in this)
        {
            if (!['_data','_evaluatedCSS','_evaluatedHTML','_evaluatedSnippet','_executedSnippetResult'].includes(prop))
            {
                exportData[prop.replace("_","")] = this[prop];
            }
        }
        return exportData;
    }

    /**
     * Loads an external CSS file.
     */
    loadCSS()
    {
        // if css is undefined or blank then is loaded, else load css src
        if (!['', undefined].includes(this._srcCSS))
        {
            // check if js file exists
            Array.from(document.links).forEach(
                link =>
                {
                    if (link.href === this._srcCSS)
                    {
                        this._loaded = this._loaded | WIDGET_CSS_LOADED;
                    } 
                }
            );
            var link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = this._srcCSS;

            let self = this;
            link.onload = function ()
                {
                    self._loaded = self._loaded | WIDGET_CSS_LOADED;
                };
            document.head.appendChild(link);
        }
        else
        {
            this._loaded = this._loaded | WIDGET_CSS_LOADED;
        }
    }

    /**
     * Loads an external javascript file.
     */
    loadJS()
    {
        // if js is undefined or blank then is loaded, else load js src
        if (!['', undefined].includes(this._srcJS))
        {
            // check if js file exists
            Array.from(document.scripts).forEach(
                script =>
                {
                    if (script.src === this._srcJS)
                    {
                        this._loaded = this._loaded | WIDGET_JS_LOADED;
                    } 
                }
            );
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = this._srcJS;

            let self = this;
            script.onload = function ()
                {
                    self._loaded = self._loaded | WIDGET_JS_LOADED;
                };
            document.head.appendChild(script);
        }
        else
        {
            this._loaded = this._loaded | WIDGET_JS_LOADED;
        }
    }

    /**
     * Reset evaluations values.
     */
    resetEvals()
    {
        this._evaluatedCSS = undefined;
        this._evaluatedHTML = undefined;
        this._evaluatedSnippet = undefined;
        this._executedSnippetResult = undefined;
    }

    /**
     * Reset labels and values values.
     */
    resetLabelsAndValues()
    {
        this._data = {labels:[], values:[]};
    }
}