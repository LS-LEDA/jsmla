/*
Moodle Web Log Analytics Tool for Moodle Standard Logs
Copyright (c) 2020 Source code, Daniel Amo
Released under the MIT License
*/

/** Class representing a Moodle Standard Logs Database. */
class MoodleStandardLogsDataBase {
  /**
   * Create a Moodle Log Database.
   * @constructor
   * @param {object} mdlbConfig - The default configuration value.
   */
  constructor(mdlbConfig) {
    /** @type {array} */
    this._logs = new Array();

    /** @type {array} */
    this._rawLogs = new Array();

    /** @type {function} */
    this._schema = mdlbConfig.schema;

    /** @type {object} */
    this._filters = mdlbConfig.filters;

    /** @type {object} */
    this._globalFilter =
      undefined !== mdlbConfig.globalFilter ? mdlbConfig.globalFilter : {};

    /** @type {object} */
    this._widgetFilter =
      undefined !== mdlbConfig.widgetFilter ? mdlbConfig.widgetFilter : {};

    this._navigator = {};
  }

  /**
   * Get the logs value.
   * @return {array} The logs value.
   */
  get logs() {
    return this._logs;
  }

  /**
   * Get the global filter value.
   * @return {object} The global filter value.
   */
  get globalFilter() {
    return this._globalFilter;
  }

  /**
   * Get the default widget filter value.
   * @return {object} The default widget filter value.
   */
  get widgetFilter() {
    return this._widgetFilter;
  }

  /**
   * Set the global filter value.
   * @param {object} The global filter value.
   */
  set globalFilter(filter) {
    this._globalFilter = filter;
  }

  /**
   * Set the default widget filter value.
   * @param {object} The default widget filter value.
   */
  set widgetFilter(filter) {
    this._widgetFilter = filter;
  }

  schema(item) {
    /*
            Standard json exported log fields:
                fullDate
                user
                affectedUser
                context
                component
                event
                description
                origin
                ip
            
            Computed fileds:
                yearMonthDay
                yearMonthDayHourMinute

        */
    return {
      fullDate: item[0],
      yearMonthDay:
        item[0].substr(6, 4) +
        "" +
        item[0].substr(3, 2) +
        "" +
        item[0].substr(0, 2),
      yearMonthDayHourMinute:
        item[0].substr(6, 4) +
        "" +
        item[0].substr(3, 2) +
        "" +
        item[0].substr(0, 2) +
        "" +
        item[0].substr(11, 2) +
        "" +
        item[0].substr(14, 2),
      timestamp: Date.parse(item[0]) / 1000,
      user: item[1],
      affectedUser: item[2],
      context: item[3],
      component: item[4],
      event: item[5],
      description: item[6],
      origin: item[7],
      ip: item[8],
    };
  }

  /**
   * Read Moodle Log from JSON file.
   * @param {object} e - The default event file value.
   * @param {function} callbackLoad - The default callback load value.
   * @param {function} callbackProgress - The default callback progress value.
   */
  readLogFromFile(e, callbackLoad, callbackProgress) {
    var file = e.target.files[0];
    var reader = new FileReader();
    var logs = this._logs;

    if (!file) {
      throw new Error({ errno: ERROR_EXCEPTION_FILE, msg: "Invalid file." });
    }

    /**
     * Event onload for file reader.
     * @param {event} e - The event value.
     */
    let self = this;
    reader.onload = function (e) {
      try {
        JSON.parse(e.target.result)[0].forEach((item) => {
          // no transformation, logs will contain arrays of data
          logs[logs.length] = item;
        });
        self.init();
        e.fileName = file.name;
        callbackLoad(e, null);
      } catch (e) {
        callbackLoad(
          e,
          new Error({
            errno: ERROR_EXCEPTION_JSON,
            msg: "Cannot parse JSON.",
          })
        );
      }
    };

    /**
     * Event onprogress for file reader.
     * @param {event} e - The event value.
     */
    reader.onprogress = function (e) {
      typeof callbackProgress !== "undefined" ? callbackProgress(e) : 1;
    };

    reader.readAsText(file);
  }

  /**
   * Apply filter by widget.
   * @param {object} filterObj - The filter configuration value.
   */
  filter(filterConfig) {
    // Copy raw logs to logs
    this.logsCopy(this._logs, this._rawLogs);

    // apply default widget filter: filterConfig overrides _widgetFilter
    // set priority to widget filter config
    /*for (let field in filterConfig)
        {
            if (undefined !== this._widgetFilter[field])
            {
                delete this._widgetFilter[field];
            }
        }
        this.applyFilter(this._widgetFilter);

        // apply widget filter
        this.applyFilter(filterConfig);*/

    // apply widget filter: _widgetFilter overrides filterConfig
    // set priority to dashboard widget default filter config
    for (let field in filterConfig) {
      if (undefined !== this._widgetFilter[field]) {
        delete filterConfig[field];
      }
    }
    this.applyFilter(filterConfig);

    this.applyFilter(this._widgetFilter);
  }

  /**
   * Apply filter.
   * @param {object} filterObj - The filter configuration value.
   */
  applyFilter(filterConfig) {
    // apply schema if needed
    this._logs = this._logs.map((row) => {
      let rowSchema = row;
      // filtering needs an object instead of an array
      // check if row is an array (first time filtering) or an object
      // if row is an array it is needed to transform it to a schema object
      if (Array.isArray(row)) {
        rowSchema = {};
        // check if is set schema user callback
        if (undefined === this._schema) {
          // default schema
          rowSchema = this.schema(row);
        } else {
          // schema user callback
          rowSchema = this._schema(row);
        }
      }
      return rowSchema;
    });

    // check if there is filter configuration
    if (undefined !== filterConfig) {
      // iterate throw each field in the filter
      for (let field in filterConfig) {
        // a field filter is suposed to be always an array so multiple filters for a filed can be applied
        if (Array.isArray(filterConfig[field])) {
          filterConfig[field].forEach((query) => {
            // will store filtered rows
            let dataset = new Array();

            this._logs.forEach((row) => {
              // include or exclude row by filter query
              if (this.filterRegEx(row, field, query)) {
                dataset.push(row);
              }
            });

            // set the filtered store
            this._logs = dataset;
          });
        }
      }
    }
  }

  /**
   * Get the countified labels of the dataset value.
   * @param {array} row - A log's row value.
   * @param {string} field - The field to apply filter.
   * @param {string} query - The query to execute in field's row value.
   * @return {boolean} True if query , else False.
   */
  filterRegEx(row, field, query) {
    let addToRow = false;

    // check if it is a negate query
    let not = -1 < query.indexOf("NOT ");

    // clean NOT word
    if (not) {
      query = query.replace("NOT ", "");
    }

    // get filter
    let filters = this._filters();
    let filterId = query.split(" ")[0];
    let regex = filters[filterId].regex;
    let fn = filters[filterId].fn;
    let m;

    if ((m = regex.exec(query)) !== null) {
      let values = m[1].split(",");

      addToRow = fn(row[field], values[0], values[1]);

      // check if it is a negate filter
      if (not) {
        addToRow = !addToRow;
      }
    }

    return addToRow;
  }

  init() {
    // apply global filter
    this.applyFilter(this._globalFilter);

    // backup logs
    this.logsCopy(this._rawLogs, this._logs);
  }

  /**
   * Make a copy of logs: logs to RawLogs.
   * @param {array} dest - The destination array value.
   * @param {array} origin - The origin array value.
   */
  logsCopy(dest, origin) {
    // delete destination storage elements
    dest.splice(0, dest.length);

    // fill with elements of origin storage
    origin.forEach((item) => {
      dest.push(item);
    });
  }

  /**
   * Get the countified labels of the dataset value.
   * @param {string} field - The field value.
   * @param {string} sortBy - The field to sortBy value.
   * @param {string} order - The order value.
   * @param {string} limit - The limit value.
   * @return {array} The countified labels value.
   */
  labelsCount(field, sortBy = "value", order = "DESC", limit = undefined) {
    let labels = {};
    let newLabels = new Array();

    // count duplicates
    this._logs.forEach(function (obj) {
      labels[obj[field]] = (labels[obj[field]] || 0) + 1;
    });

    // new dataset is {key:'', value:0}
    for (var prop in labels) {
      newLabels.push({ key: prop, value: labels[prop] });
    }

    // sort
    labels = this.sort(newLabels, sortBy, order);

    // limit results
    if (undefined !== limit) {
      labels.length = limit;
    }
    return labels;
  }

  /**
   * Get the countified labels of the dataset value.
   * @param {string} field - The field value.
   * @param {string} groupField - The group field value.
   * @param {string} sortBy - The field to sortBy value.
   * @param {string} order - The order value.
   * @param {string} limit - The limit value.
   * @return {array} The countified labels value.
   */
  labelsCountGroup(
    field,
    groupField = "fullDate",
    sortBy = "value",
    order = "DESC",
    limit = undefined
  ) {
    let labels = {};
    let newLabels = new Array();

    // count duplicates
    let group = {};
    this._logs.forEach((row) => {
      group[row[groupField]] = 0;
    });
    this._logs.forEach((row) => {
      for (let prop in group) {
        labels[row[field]] = labels[row[field]] || {};
        if (prop === row[groupField]) {
          labels[row[field]][prop] = (labels[row[field]][prop] || 0) + 1;
          break;
        }
      }
    });

    // new dataset is {key:'', value:0}
    for (var prop in labels) {
      newLabels.push({ key: prop, value: labels[prop] });
    }

    // sort
    labels = this.sort(newLabels, sortBy, order);

    // limit results
    if (undefined !== limit) {
      labels.length = limit;
    }
    return labels;
  }

  /**
   * Get the last connection of the dataset value.
   * @param {string} field - The field value.
   * @param {string} groupField - The group field value.
   * @param {string} sortBy - The field to sortBy value.
   * @param {string} order - The order value.
   * @param {string} limit - The limit value.
   * @return {array} The countified labels value.
   */
  labelsLastInteraction(
    field,
    groupField = "fullDate",
    sortBy = "value",
    order = "DESC",
    limit = undefined
  ) {
    let labels = {};
    let newLabels = new Array();

    // set last interaction
    this._logs.forEach(function (obj) {
      if (
        labels[obj[field]] < obj[groupField] ||
        undefined === labels[obj[field]]
      ) {
        labels[obj[field]] = obj[groupField];
      }
    });

    // new dataset is {key:'', value:0}
    for (var prop in labels) {
      newLabels.push({ key: prop, value: labels[prop] });
    }

    // sort
    labels = this.sort(newLabels, sortBy, order);

    return labels;
  }

  /**
   * Get the time dedication for each field.
   * @param {string} field - The field value.
   * @param {string} sortBy - The field to sortBy value.
   * @param {string} order - The order value.
   * @param {string} timeField - The timestamp field value.
   * @param {number} timeSession - The time of the session in minutes value.
   * @param {string} limit - The limit value.
   * @return {array} The countified labels value.
   */
   timededication(
    field,
    sortBy = "value",
    order = "DESC",
    timeField = "timestamp",
    timeSession = 15,
    limit = undefined
  ) {
    let labels = new Array();
    let newLabels = new Array();

    // copy & sort
    this.logsCopy(labels, this._logs);
    labels = this.sort(labels, timeField, "ASC");
    
    // detect time dedication
    let count = 0;
    labels.forEach(function (obj) {
      if (
        undefined === newLabels[obj[field]]
      ) {
        // add first interaction
        newLabels[obj[field]] = {
          total: 1,
          timeField: obj[timeField]
        };
      }
      else {
        // compare last available interaction if in time session
        let minutes = ( obj[timeField] - newLabels[obj[field]].timeField ) / 1000 / 60;
        if (
          minutes <= timeSession
        ) {
          // add minutes difference
          newLabels[obj[field]].total += minutes;
        }
        else {
          // add 1 minute for each hit below timeSession
          newLabels[obj[field]].total++;
        }
        newLabels[obj[field]].timeField = obj[timeField];
      }
    });

    // new dataset is {key:'', value:0}
    labels = new Array();
    for (var prop in newLabels) {
      labels.push({ key: prop, value: newLabels[prop].total });
    }

    // sort
    labels = this.sort(labels, sortBy, order);

    return labels;
  }

  /**
   * Get rows by keys of the dataset value.
   * @param {string} dataset - The array value.
   * @param {string} key - The field to order by value.
   * @return {array} The labels value.
   */
  extractByKey(dataset, key) {
    let keys = new Array();
    for (var row in dataset) {
      keys.push(dataset[row][key]);
    }
    return keys;
  }

  /**
   * Get the labels keys of the dataset value.
   * @param {string} field - The field value.
   * @param {string} sortBy - The field to sortBy value.
   * @param {string} order - The order value.
   * @param {string} fn - The function to calculate values.
   * @return {array} The labels value.
   */
  labelsAndValues(
    field,
    sortBy = "value",
    order = "DESC",
    limit = undefined,
    calcFn = { fn: "count", field: undefined }
  ) {
    let lav = {};

    // if field set then extract key/value, else return logs count
    if (undefined !== field) {
      let labels;
      switch (calcFn.fn) {
        // group by field and set values to: time dedication 
        case "timededication":
          labels = this.timededication(
            field,
            sortBy,
            order,
            calcFn.field,
            calcFn.session,
            limit
          );
          break;
        // group by field and set values to: count occurrences
        case "count":
          labels = this.labelsCount(field, sortBy, order, limit);
          break;
        // group by field, group by a secon field and set values to: count occurrences
        case "countgroup":
          labels = this.labelsCountGroup(
            field,
            calcFn.field,
            sortBy,
            order,
            limit
          );
          break;
        // group by field and set values to: last connection
        case "lastconnection":
          labels = this.labelsLastInteraction(
            field,
            calcFn.field,
            sortBy,
            order,
            limit
          );
          break;
      }

      lav.labels = this.extractByKey(labels, "key");
      lav.values = this.extractByKey(labels, "value");
    } else {
      lav.labels = [""];
      lav.values = [this._logs.length];
    }

    return lav;
  }

  sort(data, sortBy, order) {
    // sortBy if is set
    if (sortBy) {
      data = data.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) {
          return "DESC" === order ? 1 : -1;
        }
        if (a[sortBy] > b[sortBy]) {
          return "DESC" === order ? -1 : 1;
        }
        return 0;
      });
    }
    return data;
  }
}
