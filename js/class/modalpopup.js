/*
Moodle Web Log Analytics Tool from Moodle Standard Logs
Copyright (c) 2020 Source code, Daniel Amo
Released under the MIT License
*/

/** @type {ModalPopup} */
var eventModalPopup;

/** Class modal message. */
class ModalPopup
{
    
  /**
  * Create a modal msg popup window.
  * @constructor 
  * @param {JSON} mpConfig - The default configuration value.
  */
  constructor(mpConfig)
  {
    eventModalPopup = this;
    if (undefined !== mpConfig && undefined !== mpConfig.template)
    {
      this._template = mpConfig.template;
    }
    else
    {
      this._template = '<style type="text/css">\
        #modal {display: none;position: fixed;z-index: 1;left: 0;top: 0;width: 100%;height: 100%;overflow: auto;background-color: rgb(0,0,0);background-color: rgba(0,0,0,0.4);}\
        #modal .container {background-color: #fefefe;margin: 70px auto;border: 3px solid #666666;width: 80%;overflow: auto;resize: both;}\
        #modal .content {padding: 10px 16px;}\
        #modal .header {padding: 2px 16px;background-color: #333;line-height: 20px;}\
        #modal .header .content {color: white;font-size: 22px;font-weight: bold;padding-left:0px !important;}\
        #modal .close {color: #aaa;float: right;font-size: 40px;font-weight: bold;cursor: pointer;margin-top:10px;}\
        #modal .close:hover,.close:focus {color: white;text-decoration: none;cursor: pointer;}\
        </style>\
        <div id="modal">\
            <div class="container">\
                <div class="header">\
                  <span class="close">&times;</span>\
                  <div id="header" class="content"></div>\
                </div>\
              <div id="body" class="content"></div>\
            </div>\
        </div>';
    }
  }

  /**
   * Update DOM and initialize pointer to elements.
   * @param {object} The initialization configuration value.
   */
  init(initConfig)
  { 
    let classConfig;
    if (undefined !== initConfig && undefined !== initConfig.classes)
    {
      classConfig = initConfig.classes;
    }
    else
    {
      // default classes from constructor template
      classConfig = {
        modalId:'modal'
        ,containerClass:'.container'
        ,headerClass:'.header'
        ,headerContentClass:'.header > .content'
        ,contentClass:'.container > .content'
        ,closeClass:'.close'
      };
    }

    // delete modal
    let modal = document.getElementById(classConfig.modalId);
    if (![null, undefined].includes(modal))
    {
      //modal.remove();
    }

    document.body.insertAdjacentHTML("beforeend", this._template);
    
    this._window = document.getElementById(classConfig.modalId);
    this._container = this._window.querySelector(classConfig.containerClass);
    this._header = this._window.querySelector(classConfig.headerClass);
    this._headerContent = this._header.querySelector(classConfig.headerContentClass);
    this._content = this._container.querySelector(classConfig.contentClass);
    this._closeBtn = this._container.querySelector(classConfig.closeClass);
    
    // Assign on click event to close()
    ['click'].forEach(eventName => {
      this._closeBtn.addEventListener(eventName, this.close);
    });
  }

  /**
   * Set the header content value.
   * @param {string} The header content value.
   */
  set headerContent(html)
  {
    this._headerContent.innerHTML = "";
    this._headerContent.insertAdjacentHTML("afterbegin", html);
  }

  /**
   * Set the body of the modal popup.
   * @param {string} The delimiter value.
   */
  set content(html)
  {
    this._content.innerHTML = "";
    this._content.insertAdjacentHTML("afterbegin", html);
  }

  /**
   * Makes the msg popup window visible.
   */
  show()
  {
    this._window.style.display = 'block';
    
    // When the user clicks anywhere outside of the modal, close it
    ['click'].forEach(eventName => {
      window.addEventListener(eventName, this.closeEvent, false);
    });
  }

  /**
   * Hides the msg popup window.
   */
  close()
  {
    // used 'eventModalPopup' instead 'this' to enable close() an event handler
    eventModalPopup._window.style.display = 'none';
    ['click'].forEach(eventName => {
      window.removeEventListener(eventName, eventModalPopup.clickEvent);
    });
  }

  /**
   * Event helper: Uses global ModelPopup object to close it.
   */
  closeEvent(e)
  {
    if (e.target == eventModalPopup._window)
    {
      eventModalPopup.close();
    }
  }

}