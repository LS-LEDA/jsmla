/*
Moodle Web Log Analytics Tool from Moodle Standard Logs
Copyright (c) 2020 Source code, Daniel Amo
Released under the MIT License
*/

/** Class representing a Dashboard. */
class Dashboard {
  /**
   * Manages a Dashboard.
   * @constructor
   * @param {object} dashbConfig - The default configuration value.
   */
  constructor(dashbConfig) {
    /** @type {string} */
    this._version = "";

    /** @type {object} */
    this._gobalCfg = dashbConfig.global;

    /** @type {BrowserStorage} */
    this._bstorage = new BrowserStorage();

    /** @type {array} */
    this._widgets = new Array();

    /** @type {number} */
    this._counter = 0;

    /** @type {object} */
    this._widgetDefaults = dashbConfig.widget;

    /** @type {MoodleStandardLogsDataBase} */
    this._msldb = new MoodleStandardLogsDataBase(dashbConfig.db);

    /** @type {ModalPopup} */
    this._modal = new ModalPopup();
  }

  /**
   * Get the global filter value.
   * @return {object} The global filter value.
   */
  get gobalCfg() {
    return this._gobalCfg;
  }

  /**
   * Get the widgets value.
   * @return {array} The widgets value.
   */
  get widgets() {
    return this._widgets;
  }

  /**
   * Get the widget template value.
   * @return {WidgetTemplate} The template value.
   */
  get widgetTemplate() {
    return this._widgetTemplate;
  }

  /**
   * Get the msldb value.
   * @return {MoodleStandardLogsDataBase} The msldb value.
   */
  get msldb() {
    return this._msldb;
  }

  /**
   * Get the modal value.
   * @return {ModalPopup} The modal value.
   */
  get modal() {
    return this._modal;
  }

  /**
   * Get the browser storage value.
   * @return {BrowserStorage} The browser storage value.
   */
  get bstorage() {
    return this._bstorage;
  }

  /**
   * Get the widget object by id.
   * @return {object} The widget value.
   */
  getWidgetById(id) {
    return this._widgets.find((widget) => id == widget.id);
  }

  /**
   * Set the widget object by id.
   * @param {string} id - The id of the widget to update.
   * @param {object} widget - The new widget values.
   */
  setWidgetById(id, widget) {
    let w = this._widgets.find((widget) => id == widget.id);
    this._widgets[w._index] = widget;
  }

  /**
   * Creates a widget.
   * @param {object} widgetConfig - The default configuration value.
   */
  createWidget(widgetConfig) {
    // set default config without overriding personalized config
    if (undefined !== this._widgetDefaults) {
      for (let prop in this._widgetDefaults) {
        if (undefined === widgetConfig[prop]) {
          widgetConfig[prop] = this._widgetDefaults[prop];
        }
      }
    }

    // create widget
    let widget = new Widget(++this._counter, widgetConfig);

    // add widget to widgets array
    this._widgets.push(widget);
  }

  /**
   * Return dashboard into an object.
   * @param {string} fileName - The filename to download value.
   */
  download(fileName) {
    dashb.bstorage.save({ fileName: fileName + ".dsb", data: this.toObject() });
  }

  /**
   * Imports dashboard from an object.
   * @param {object} dashbObj - The dashboard object value.
   */
  import(dashbObj) {}

  /**
   * Executes any initialization needed to run the dashboard.
   */
  init() {
    // initialize modal popup
    this._modal.init();

    // render css
    document.head.insertAdjacentHTML(
      "beforeend",
      '<style type="text/css">' + this._gobalCfg.css + "</style>"
    );
  }

  /**
   * Read dashboard object file.
   * @param {object} e - The default event file value.
   * @param {function} callbackLoad - The default callback load value.
   */

  /* Identifica archivo y trata el json */
  readFromFile(e, callbackLoad) {
    var file = e.target.files[0];
    var reader = new FileReader();

    if (!file) {
      throw new Error({ errno: ERROR_EXCEPTION_FILE, msg: "Invalid file." });
    }

    /**
     * Event onload for file reader.
     * @param {event} e - The event value.
     */
    let self = this;

    /*Configura el objeto Dashboard, pone todoa default  */
    reader.onload = function (e) {
      let dashbObj = JSON.parse(e.target.result);

      // configurations
      self._gobalCfg = dashbObj.global;
      self._widgetDefaults = dashbObj.widget;

      // database (convert functions to arrow functions)
      self._msldb._schema = eval(
        dashbObj.db.schema.replace(/function .*()/g, "item=>")
      );
      self._msldb._filters = eval(
        dashbObj.db.filters.replace(/function .*()/g, "()=>")
      );
      self._msldb._globalFilter = eval(dashbObj.db.globalFilter);
      self._msldb._widgetFilter = eval(dashbObj.db.widgetFilter);

      // widgets
      self._counter = 0;
      e.widgets = dashbObj.widgets;

      callbackLoad(e);
    };

    reader.readAsText(file);
  }

  /**
   * Return all the chart's javascript code & data to eval or the report in text format of a widget.
   * @param {function} callbackJS - The callback Javascript value.
   * @param {function} callbackText - The callback Text value.
   */
  renderAllWidgets(callbackJS, callbackText) {
    this._widgets.forEach((widget) => {
      this.renderWidget(widget, callbackJS, callbackText);
    });
  }

  renderWidget(widget, callbackJS, callbackText) {
    widget.resetLabelsAndValues();
    widget.resetEvals();

    widget.evalCSSHTML();

    if (WIDGET_CODE_SNIPPET === widget.mode) {
      // filter can be an array of filters so dataset can be multiple (i.e. multiple timeline series
      if (Array.isArray(widget.filter)) {
        widget.filter.forEach((filter) => {
          this._msldb.filter(filter);
          let lvs = this._msldb.labelsAndValues(
            widget.field,
            widget.sortBy,
            widget.order,
            widget.limit,
            widget.calcFn
          );
          widget.data.labels[widget.data.labels.length] = lvs.labels;
          widget.data.values[widget.data.values.length] = lvs.values;
        });
      } else {
        this._msldb.filter(widget.filter);
        widget.data = this._msldb.labelsAndValues(
          widget.field,
          widget.sortBy,
          widget.order,
          widget.limit,
          widget.calcFn
        );
      }
      if (widget.data.values.length === 0 && !widget.counter) {
        widget.visible = false;
      }
      callbackJS(widget);
    } else {
      callbackText(widget);
    }
  }

  /**
   * Return dashboard as an object.
   */
  toObject() {
    let exportJSON = {
      version: "0",
      global: this._gobalCfg,
      widget: this._widgetDefaults,
      db: {
        schema: this._msldb._schema.toString(),
        filters: this._msldb._filters.toString(),
        globalFilter: this._msldb._globalFilter,
        widgetFilter: this._msldb.widgetFilter,
      },
      widgets: [],
    };
    for (let i = 0; i < this._widgets.length; i++) {
      exportJSON.widgets[exportJSON.widgets.length] = this._widgets[i].export();
    }
    return exportJSON;
  }
}
