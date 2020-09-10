/*
Moodle Web Log Analytics Tool from Moodle Standard Logs
Copyright (c) 2020 Source code, Daniel Amo
Released under the MIT License
*/

/** Class file handling + drag&drop. */
class FileHandler
{

  /**
   * Create a file handling + drag&drop events.
   * @constructor 
   * @param {JSON} fhConfig - The default configuration value.
   */
  constructor(fhConfig)
  {
    /** @type {function} */
    this._callback = fhConfig.callback;

    /** @type {HMTLElement} */
    this._dropArea = fhConfig.dropArea;

    /** @type {HMTLElement} */
    this._fileInput = fhConfig.fileInput;

    /** @type {string} */
    this._classHighlight = fhConfig.classHighlight;
  }

  setHandlers()
  {
    var dropArea = this._dropArea;
    var self = this;

    if (undefined !== dropArea)
    {
      function handleFiles(files) {
        ([...files]).forEach(uploadFile);
      }
      
      function uploadFile(file) {
        self._callback({target:{files:[file]}});
      }

      function handleDrop(e) {
        let dt = e.dataTransfer;
        let files = dt.files;
      
        handleFiles(files);
      }
      
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false)
      });
      
      function preventDefaults (e) {
        e.preventDefault();
        e.stopPropagation();
      };

      ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
      });
      
      ;['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
      });
      
      function highlight(e) {
        dropArea.classList.add(self._classHighlight);
      }
      
      function unhighlight(e) {
        dropArea.classList.remove(self._classHighlight);
      }

      dropArea.addEventListener('drop', handleDrop, false);
    }

    this._fileInput.addEventListener('change', this._callback, false);
  }
}