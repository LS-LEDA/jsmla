/**
 * FILE DESCRIPTION: Client starting
 * @package jsmla
 * @copyright 2020 Daniel Amo * daniel.amo@salle.url.edu
 * @copyright 2020 La Salle Campus Barcelona, Universitat Ramon Llull https://www.salleurl.edu
 * @author Daniel Amo
 * @author Pablo Gómez
 * @author Nicole Marie Jimenez
 * @author Sandra Cea Torrescassana
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

const COTRAMOKEYS = {
  FULLDATE: "Marca temporal",
  CONSENTIMIENTO: " Por todo ello, DOY MI CONSENTIMIENTO:",
  DNI: "DNI o Pasaporte",
  TAG: "TAG",
  CENTER: "Center",
  INDICADOR_1A:
    "Indicador 1: Realiza las tareas que le son asignadas dentro del grupo en los plazos requeridos.",
  INDICADOR_2A:
    "Indicador 2: Participa de forma activa en los espacios de encuentro del equipo, compartiendo la información, los conocimientos y las experiencias",
  INDICADOR_3A:
    "Indicador 3: Colabora en la definición, la organización y distribución de las tareas de grupo.",
  MAYOR_POS_MEJORA_INDICADOR_A:
    "Señala el indicador sobre el que percibes mayor posibilidad de mejora: ",
  PLAN_MEJOR_INDICADOR_A:
    "Señala un plan de mejora para avanzar en el indicador en el que percibas una mayor debilidad: ",
  INDICADOR_1B: "Indicador 1: Transmito información relevante.",
  INDICADOR_2B:
    "Indicador 2: Las presentaciones están estructuradas, cumpliendo con los requisitos exigidos, si los hubiera.",
  INDICADOR_3B: "Indicador 3: En mis presentaciones utilizo medios de apoyo.",
  MAYOR_POS_MEJORA_INDICADOR_B:
    "Señala el indicador sobre el que percibes mayor posibilidad de mejora: 2",
  PLAN_MEJOR_INDICADOR_B:
    "Señala un plan de mejora para avanzar en el indicador en el que percibas una mayor debilidad: 3",
  ACTIVIDADES_UTILES:
    "En general, las actividades previstas del curso son útiles.",
  CAPACIDAD_REALIZACION:
    "Confío en mi capacidad de realizar exitosamente las actividades establecidas.",
  METODOS_ENSENANZA:
    "Los métodos de enseñanza descritos me involucran (enganchan) activamente en el curso.",
  DISFRUTAR_ACTIVIDAD: "Creo que voy a disfrutar de las actividades del curso.",
  CAPACIDAD_CALIFICACION:
    "Me considero capaz de obtener una alta calificación en la actividad.",
  CONTROL_APRENDIZAJE:
    "Tengo control sobre cómo aprendo los contenidos del curso/actividad.",
  PREOCUPACION_PROFESOR:
    "El/la profesor/a se preocupa por mi desempeño en el curso.",
  CONOCIMIENTO_FUTURO:
    "Considero que los conocimientos adquiridos en este curso son importantes para mi futuro.",
  PROFESOR_AMIGABLE: "El/La profesor/a es amigable/comprensible.",
};

var color4 = "#cc2000";
var color3 = "#e94020";
var color2 = "#f39f91";
var color1 = "#f8c7bf";
var color0 = "#f5e3df";

String.prototype.dePersonalize = function () {
  var hash = 0;
  if (this.length == 0) {
    return hash;
  }
  for (var i = 0; i < this.length; i++) {
    var char = this.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

Date.prototype.diffTimestamp = function (timestamp) {
  let dateDiffInSec = ((this.getTime() / 1000 - timestamp) / 60 / 60) * 3600;
  let days = Math.floor(dateDiffInSec / (3600 * 24));
  dateDiffInSec -= days * 3600 * 24;
  let hours = Math.floor(dateDiffInSec / 3600);
  dateDiffInSec -= hours * 3600;
  let minutes = Math.floor(dateDiffInSec / 60);
  dateDiffInSec -= minutes * 60;
  return {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: dateDiffInSec,
  };
};

function gradient(maxVal, val) {
  let perct = (val * 100) / maxVal;
  if (perct <= 25) return color0;
  else if (perct <= 50) return color1;
  else if (perct <= 75) return color2;
  else if (perct <= 100) return color3;
}

function gradientHM(maxVal, secMaxVal, val) {
  if (val < maxVal) {
    let perct = (val * 100) / secMaxVal;
    if (perct <= 25) return color0;
    else if (perct <= 50) return color1;
    else if (perct <= 75) return color2;
    else if (perct <= 100) return color3;
  } else {
    return color4;
  }
}

function getGradientColor(start_color, end_color, percent) {
  start_color = start_color.replace(/^\s*#|\s*$/g, "");
  end_color = end_color.replace(/^\s*#|\s*$/g, "");
  if (start_color.length == 3) {
    start_color = start_color.replace(/(.)/g, "$1$1");
  }
  if (end_color.length == 3) {
    end_color = end_color.replace(/(.)/g, "$1$1");
  }
  var start_red = parseInt(start_color.substr(0, 2), 16),
    start_green = parseInt(start_color.substr(2, 2), 16),
    start_blue = parseInt(start_color.substr(4, 2), 16);
  var end_red = parseInt(end_color.substr(0, 2), 16),
    end_green = parseInt(end_color.substr(2, 2), 16),
    end_blue = parseInt(end_color.substr(4, 2), 16);
  var diff_red = end_red - start_red;
  var diff_green = end_green - start_green;
  var diff_blue = end_blue - start_blue;
  diff_red = (diff_red * percent + start_red).toString(16).split(".")[0];
  diff_green = (diff_green * percent + start_green).toString(16).split(".")[0];
  diff_blue = (diff_blue * percent + start_blue).toString(16).split(".")[0];
  if (diff_red.length == 1) diff_red = "0" + diff_red;
  if (diff_green.length == 1) diff_green = "0" + diff_green;
  if (diff_blue.length == 1) diff_blue = "0" + diff_blue;
  return "#" + diff_red + diff_green + diff_blue;
}

function dateToYMD(offset, separator = "") {
  var dateOffset = 24 * 60 * 60 * 1000 * offset; // offset days
  var d = new Date();
  d.setTime(d.getTime() - dateOffset);
  return (
    d.getFullYear() +
    separator +
    (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1) +
    separator +
    (d.getDate() < 10 ? "0" + d.getDate() : d.getDate())
  );
}

function YMDToDate(ymd) {
  let month = ymd.substr(4, 2) - 1;
  return new Date(
    ymd.substr(0, 4),
    10 > month ? "0" + month : month,
    ymd.substr(6, 2)
  );
}

/** @type {Dashboard} */
var dashb = new Dashboard({
  widget: {
    html:
      '\
        <div onresize="console.log(\'t\');" class="widget" id="%ID%" style="width:%WIDTH%px;height:%HEIGHT%px;">\n\
          <div class="widgetHeader">\
            <h2 id="title_%ID%" onclick="%CALLBACK%(\'%ID%\');" style="white-space:nowrap;overflow:hidden">%TITLE%</h2>\n\
          </div>\n\
            <div id="content_%ID%" class="content" style="width:100%;overflow:auto">\n\
              <div id="rows_%ID%" class="rows"></div>\n\
            </div>\n\
        </div>\
        <div class="tooltip_handler">\
          <p>?</p>\
          <p class="tooltip_text" id="tooltip_%ID%"> %TOOLTIP% </p>\
        </div>\
      ',
  },
  global: {
    css: "",
  },
  db: {
    schema: schema,
    filters: filters,
    widgetFilter: {
      yearMonthDay: ["BETWEENEQ (" + dateToYMD(365) + "," + dateToYMD(0) + ")"],
    },
    //globalFilter:{user: ['NOT BEGIN (Marc Segarra)','NOT BEGIN (Admin)','NOT BEGIN (Daniel Amo)','NOT BEGIN (Maria Alsina)','NOT BEGIN (Roger Olivella)','NOT BEGIN (Silvia Carretero)','NOT BEGIN (Eduard de Torres)','NOT BEGIN (Alba LLau)']}
    //widgetFilter: { yearMonthDay: ['BETWEENEQ (20000212,20200727)'] }
  },
});

/** @type {codemirror} */
var codeditor;

/**
 * Callback for input file change event.
 * @callback changeInputFile
 * @param {event} e - The event value.
 */
function changeInputFile(e) {
  displayFileContents();
  dashb.msldb.readLogFromFile(e, rlffOnLoad, rlffOnProgress);
}

// function createLoadingContent() {
//   return '<p id="loading-content">Loading content...</p>';
// }

function showFileReaderError() {
  return '<div class="timeout-error">There was an error reading the file. Please refresh the page and try again.</div>';
}

function showTimeoutError() {
  return '<div class="timeout-error">Reading the file took too long. Please refresh the page and try again.</div>';
}

/**
 * Callback for load dashboard input file change event.
 * @callback fillDashboard
 * @param {event} e - The event value.
 */
function fillDashboard(e) {
  dashb.readFromFile(e, rlffDashbOnLoad);
}

/**
 * Callback for fillDashboard on load management.
 * @callback rlffDashbOnLoad
 * @param {event} e - The event value.
 */
function rlffDashbOnLoad(e) {
  // dashboard initialization
  dashb.init();

  renderDashboard(e.widgets);
}

function navigatorFilter(index, val, field) {
  //let navigator = document.getElementById("menu-navigator");
  dashb.msldb.widgetFilter = dashb.msldb.widgetFilter || {};
  if (0 == index) val = "";
  dashb.msldb.widgetFilter[field] = ["BEGIN (" + val + ")"];
  //dashb.msldb.init();
  reRenderDashboard();
}

function reRenderDashboard() {
  if (0 < dashb.widgets.length) {
    let dashLoader = document.getElementById("loading-resources");

    document.getElementById("widgets").innerHTML = "";
    document.getElementById("widgets").style.opacity = 0.5;

    dashLoader.style.display = "block";

    let renderPromise = new Promise((resolve, reject) => {
      setTimeout(function () {
        resolve();
      }, 250);
    });

    renderPromise.then(() => {
      renderDashboard(dashb.widgets);
    });
  }
}

/**
 * Callback for readLogFromFile on load management.
 * @callback rlffOnLoad
 * @param {event} e - The event value.
 */
function rlffOnLoad(e, error) {
  // if (error !== null && error.errno === 2) {
  //   displayFileContents(showFileReaderError());
  // } else {
  let logLabel = document.getElementById("file-log-label");
  let dropArea = document.getElementById("drop-area");
  let subHeader = document.getElementById("subheader");
  let menuBar = document.getElementById("menu-bar");
  let menuLeft = document.getElementById("menu-left");
  let dash = document.getElementById("dashboard");
  let subjectName;
  try {
    subjectName = dashb.msldb.logs[0].context.split("_")[1];
  } catch (e) {
    subjectName = "";
  }

  subHeader.style.display = "flex";
  menuBar.style.display = "block";
  menuLeft.style.display = "none";
  dropArea.style.display = "none";
  dash.style.marginLeft = "0";
  logLabel.innerHTML = "Log: <b>" + e.fileName + "</b>";
  document.title = subjectName + " | COTRAMO Log Analytics";

  renderDefaultDashboard();
  // }
}

const timeoutPromise = function (ms, promise) {
  // Create a promise that rejects in <ms> milliseconds
  let timeout = new Promise((resolve, reject) => {
    let id = setTimeout(() => {
      clearTimeout(id);
      reject("Timed out in " + ms + "ms.");
    }, ms);
  });

  // Returns a race between our timeout and the passed in promise
  return Promise.race([promise, timeout]);
};

/**
 * Callback for readLogFromFile progress management.
 * @callback rlffOnEventProgress
 * @param {event} e - The event value.
 */
function rlffOnProgress(e) {
  let dataLoadingPromise = function () {
    return new Promise((resolve, reject) => {
      let total = Math.floor(Math.round(e.total / 1024 / 1024));
      let progress = Math.floor(Math.round(e.loaded / 1024 / 1024));
      let lcP = document.getElementById("loading-content");
      lcP.innerHTML = "Loading content (" + progress + " of " + total + ")...";
      let elem = document.getElementById("loader-my-progress");
      moveProgressBar(elem, progress, total);
    });
  };
  let loading = timeoutPromise(15000, dataLoadingPromise());

  loading.catch(() => {
    displayFileContents(showTimeoutError());
  });
}

function moveProgressBar(elem, progress, total) {
  if (elem !== undefined && elem !== null) {
    var width = parseFloat(elem.style.width) / 100.0;
    if (width <= 100) {
      elem.style.width = (progress / total) * 100 + "%";
    } else {
      elem.style.width = 0;
    }
  }
}

function createWidgets(widgets) {
  widgets.forEach((widget) => {
    dashb.createWidget(widget);
  });
}

function renderDashboard(widgets) {
  if (0 < dashb.widgets.length) {
    let dashLoader = document.getElementById("loading-resources");
    let dashLoaderMsg = document.getElementById("loading-resources-msg");
    let dashLoaderN = document.getElementById("loading-resources-n");
    let dashLoaderTotal = document.getElementById("loading-resources-total");

    dashLoaderMsg.innerHTML = "Loading charts resources";
    dashLoaderTotal.innerHTML = widgets.length;
    dashLoaderN.innerHTML = "0";
    dashLoader.style.display = "block";
    checkRender();
  }
}

function renderDefaultDashboard() {
  let widgets = [];

  let widgetsTemplate = [
    /* Campo editable de texto asignado a cada campo del filtro (por ejemplo usuario) */
    /* Poder cargar la información de dos campos distintos y filtros distintos */
    {
      html:
        '<div class="widget" id="title" style="flex-basis: 100%;">\
      <h1>Dashboard</h1>\
      </div>',
      mode: WIDGET_TEXT,
    },
    {
      html:
        '<div class="widget section" style="flex-basis: 100%;">\
      <h2>1. Topología de alumnos</h2>\
      <p>Distribución según el tipo de alumnos</p>\
      </div>',

      mode: WIDGET_TEXT,
    },
    {
      width: "1062",
      height: "300",
      title: "Distribución de tipo de alumnos",
      tooltip:
        "Gráfico circular que describe la distribución por tipo de estudiante",
      srcJS: "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
      srcCSS: "",
      mode: WIDGET_CODE_SNIPPET,
      snippet:
        "var canvas = document.createElement('canvas');\
            canvas.id = 'canvas_%ID%';\
            canvas.width = '%WIDTH%';\
            canvas.style.width = '%WIDTH%';canvas.height = '%HEIGHT%'-70;canvas.style.height = '%HEIGHT%'-70;document.getElementById('content_%ID%').appendChild(canvas);new Chart(document.getElementById('canvas_%ID%').getContext('2d'), {type: 'pie',options:{tooltips: {bodyFontColor:'#FFFFFF',bodyFontSize:14,bodyFontStyle:'bold',caretSize:0,xPadding:0,yPadding:0},responsive: false,maintainAspectRatio:false,legend:{position:'left'}},data: {labels: %LABELS%,datasets: [{data: %VALUES%,backgroundColor:['rgb(255, 99, 132)','rgb(54, 162, 235)','rgb(255, 205, 86)','rgb(255, 0, 0)','rgb(0, 255, 0)','rgb(0, 0, 255)']}]}});",
      field: "tag",
      filter: { tag: ["NOT BEGIN (undefined)"] },
    },
    {
      html:
        '<div class="widget section" style="flex-basis: 100%;">\
      <h2>2. Cantidad de alumnos por escuela:</h2>\
      <p>Información sobre el número de alumnos por escuela</p>\
      </div>',
      mode: WIDGET_TEXT,
    },
    {
      width: "1062",
      height: "300",
      title: "Distribución de tipo de alumnos",
      tooltip:
        "Gráfico circular que describe la distribución por tipo de estudiante",
      srcJS: "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
      srcCSS: "",
      mode: WIDGET_CODE_SNIPPET,
      snippet:
        "var labels = %LABELS%;\
          var values = %VALUES%;\
          var canvas = document.createElement('canvas');\
              canvas.id = 'canvas_%ID%';\
              canvas.width = '%WIDTH%';\
              canvas.style.width = '%WIDTH%';canvas.height = '%HEIGHT%'-70;canvas.style.height = '%HEIGHT%'-70;document.getElementById('content_%ID%').appendChild(canvas);new Chart(document.getElementById('canvas_%ID%').getContext('2d'), {type: 'pie',options:{tooltips: {bodyFontColor:'#FFFFFF',bodyFontSize:14,bodyFontStyle:'bold',caretSize:0,xPadding:0,yPadding:0},responsive: false,maintainAspectRatio:false,legend:{position:'left'}},data: {labels: labels,datasets: [{data: values,backgroundColor:['rgb(255, 99, 132)','rgb(54, 162, 235)','rgb(255, 205, 86)','rgb(255, 0, 0)','rgb(0, 255, 0)','rgb(0, 0, 255)']}]}});",
      field: "center",
      filter: { tag: ["NOT BEGIN (undefined)"] },
    },
    // {
    //   width: "1012",
    //   height: "300",
    //   title: "Last Access & Students",
    //   tooltip:
    //     "A plot which purpose is to show the last connection from the course's members. If you hover over the plot, it shows who was connected the last day.",
    //   srcJS: "https://canvasjs.com/assets/script/canvasjs.min.js",
    //   srcCSS: "",
    //   mode: WIDGET_CODE_SNIPPET,
    //   snippet:
    //     '\
    //   let labels = %LABELS%;\
    //   let values = %VALUES%;\
    //   let lvGroup = {};\
    //   let lvGroupStudent = {};\
    //   let dataPoints = new Array();\
    //   let maxDays = 0;\
    //   for (let i = 0; i < labels.length; i++){\
    //     let diff = new Date().diffTimestamp(values[i]);\
    //     lvGroup[diff.days] = ((undefined!==lvGroup[diff.days])?lvGroup[diff.days]:0) + 1;\
    //     if (undefined===lvGroupStudent[diff.days])\
    //     {\
    //       lvGroupStudent[diff.days] = new Array();\
    //     }\
    //     lvGroupStudent[diff.days][lvGroupStudent[diff.days].length] = labels[i];\
    //     maxDays = (diff.days > maxDays)?diff.days:maxDays;\
    //   };\
    //   for (let prop in lvGroup){\
    //     dataPoints.push({x:prop,y:lvGroup[prop]});\
    //   };\
    //   document.getElementById("content_%ID%").style.height = (%HEIGHT%-70)+"px";\
    //   var chart = new CanvasJS.Chart("content_%ID%", {\
    //     height:%HEIGHT%-70\
    //     ,animationEnabled: true,\
    //     title:{\
    //       text: ""\
    //     },\
    //     toolTip: {\
    //       contentFormatter: function ( e ) {\
    //                   return "Fa " +  e.entries[0].dataPoint.x + " dies accediren " + e.entries[0].dataPoint.y + " estudiants<br/>" + lvGroupStudent[e.entries[0].dataPoint.x].join("<br/>");  \
    //       },\
    //       shared: true\
    //     },\
    //     legend: {\
    //       cursor: "pointer",\
    //       verticalAlign: "top",\
    //       itemWidth:150\
    //     },\
    //     axisX:{\
    //       interval: 5,\
    //       maximum: maxDays+1,\
    //       includeZero: true\
    //     },\
    //     data: [\
    //       {\
    //         type: "line",\
    //         name: "Students",\
    //         showInLegend: true,\
    //         dataPoints: dataPoints\
    //       },\
    //     ]\
    //   });\
    //   chart.render();',
    //   field: "fullName",
    //   calcFn: { fn: "lastconnection", field: "timestamp" },
    // },
    // {
    //   width: "1012",
    //   height: "500",
    //   title: "Resource - Students Access Chart",
    //   tooltip:
    //     "A table which represents the amount of times the members of the course have interacted with each resource (including viewing the course).",
    //   mode: WIDGET_CODE_SNIPPET,
    //   snippet:
    //     '{\
    //     let widget = document.getElementById("content_%ID%");\
    //     let labels = %LABELS%;\
    //     let values = %VALUES%;\
    //     let height = %HEIGHT% - 130;\
    //     let axisX = new Array();\
    //     for (let i = 0; i < labels.length; i++) {\
    //       for (let prop in values[i]){\
    //         axisX[prop] = 0;\
    //       }\
    //     }\
    //     let str = "<table style=\\"min-width:150px\\">\
    //         <thead>\
    //             <tr>\
    //                 <th class=\\"tdLeft resourceStudentsAccessChart\\">Resource</th>";\
    //                 for (let prop in axisX){\
    //                   str += "<th title=\\"" + prop + "\\" class=\\"tdCenter resourceStudentsAccessChart student\\">" + prop + "</th>";\
    //                 };\
    //     str += "</tr>\
    //         </thead>\
    //         <tbody style=\'max-height:"+height+"px\'>";\
    //     let maxVal = 0;\
    //     let secMaxVal = 0;\
    //     for (let i = 0; i < labels.length; i++) {\
    //       for (let prop in axisX){\
    //         let val = ((undefined!==values[i][prop])?values[i][prop]:0);\
    //         if (val > maxVal) {\
    //           maxVal = val;\
    //         } else if (val > secMaxVal){\
    //           secMaxVal = val;\
    //         }\
    //       };\
    //     };\
    //     for (let i = 0; i < labels.length; i++) {\
    //         str += "<tr>";\
    //         str += "<td title=\\"" + labels[i].replace(\'"\',\'"\') + "\\" class=\\"tdLeft resourceStudentsAccessChart resource\\">" + labels[i] + "</td>";\
    //         for (let prop in axisX){\
    //           let val = ((undefined!==values[i][prop])?values[i][prop]:0);\
    //           str += "<td style=\\"background:"+gradientHM(maxVal,secMaxVal,val)+"\\" class=\\"tdCenter resourceStudentsAccessChart student\\">" + val.toLocaleString() + "</td>";\
    //         };\
    //         str += "</tr>"; };\
    //     str += "</tbody>\
    //         </table>";\
    //     widget.insertAdjacentHTML("afterbegin", str);\
    //   }',
    //   sortBy: "key",
    //   order: "ASC",
    //   field: "context",
    //   calcFn: { fn: "countgroup", field: "fullName" },
    //   filter: { fullName: ["NOT BEGIN (undefined)"] },
    // },
    // {
    //   width: "475",
    //   height: "500",
    //   title: "Student Participation",
    //   tooltip:
    //     "Total number of interactions between each member of the course and all the resources, including seeing the course.",
    //   mode: WIDGET_CODE_SNIPPET,
    //   snippet:
    //     '{\
    //     let interactions = dashb.widgets[2].data.values[0];\
    //     let widget = document.getElementById("content_%ID%");\
    //     let labels = %LABELS%;\
    //     let values = %VALUES%;\
    //     let height = %HEIGHT% - 100;\
    //     let str = "<table>\
    //         <thead>\
    //             <tr>\
    //                 <th  class=\\"tdLeft studentParticipation student\\">Student</th>\
    //                 <th class=\\"tdCenter studentParticipation\\">%</th>\
    //                 <th class=\\"tdCenter studentParticipation\\">#</th>\
    //             </tr>\
    //         </thead>\
    //         <tbody style=\'max-height:"+height+"px\'>";\
    //     for (let i = 0; i < labels.length; i++) {\
    //         let percent = (values[i]*100)/interactions;\
    //         str += "<tr>";\
    //         str += "<td class=\\"tdLeft studentParticipation student\\">" + labels[i] + "</td>";\
    //         str += "<td class=\\"tdCenter " + ((10<percent)?"tdGreenLight":((5<percent)?"tdOrangeLight":"tdRedLight")) + " studentParticipation\\">" + (Math.round(percent*100)/100).toLocaleString() + "%</td>";\
    //         str += "<td class=\\"tdCenter studentParticipation\\">" + values[i] + "</td>";\
    //         str += "</tr>"; };\
    //     str += "</tbody>\
    //         </table>";\
    //     widget.insertAdjacentHTML("afterbegin", str);\
    //   }',
    //   sortBy: "key",
    //   order: "ASC",
    //   field: "fullName",
    // },
    // {
    //   width: "475",
    //   height: "500",
    //   title: "Members last access",
    //   tooltip:
    //     "List of each member of the course and the last time they accessed the course.",
    //   mode: WIDGET_CODE_SNIPPET,
    //   snippet:
    //     '{\
    //     let interactions = dashb.widgets[2].data.values[0];\
    //     let widget = document.getElementById("content_%ID%");\
    //     let labels = %LABELS%;\
    //     let values = %VALUES%;\
    //     let height = %HEIGHT% - 100;\
    //     let str = "<table>\
    //         <thead>\
    //             <tr>\
    //                 <th class=\\"tdLeft lastAccess\\">Student</th>\
    //                 <th class=\\"tdCenter lastAccess\\">Last Access</th>\
    //             </tr>\
    //         </thead>\
    //         <tbody style=\'max-height:"+height+"px\'>";\
    //     for (let i = 0; i < labels.length; i++) {\
    //       if (labels[0].length){\
    //         let wDate = new Date(values[i]*1000).toLocaleString();\
    //         let percent = (values[i]*100)/interactions;\
    //         let wDateDiff = new Date().diffTimestamp(values[i]);\
    //         let wDateStr = wDateDiff.days+" dies "+wDateDiff.hours+" hores <br />"+wDateDiff.minutes+" minuts, "+Math.floor(wDateDiff.seconds)+" segons";\
    //         str += "<tr>";\
    //         str += "<td class=\\"tdLeft lastAccess\\">" + labels[i] + "</td>";\
    //         str += "<td class=\\"tdCenter " + ((1>wDateDiff.days)?"tdGreenLight":((3>wDateDiff.days)?"tdOrangeLight":"tdRedLight")) + " lastAccess\\">" + wDate + "<br/><b>" + wDateStr + "</b></td>";\
    //         str += "</tr>"; };\
    //       }\
    //       str += "</tbody>\
    //         </table>";\
    //       widget.insertAdjacentHTML("afterbegin", str);\
    //     }',
    //   field: "fullName",
    //   calcFn: { fn: "lastconnection", field: "timestamp" },
    // },
    {
      html:
        '<div class="widget section" style="flex-basis: 100%;">\
      <h2>3. Distribución de respuestas para Trabajo en Equipo:</h2>\
      <p>Información sobre las respuestas para el Trabajo en Equipo</p>\
      </div>',
      mode: WIDGET_TEXT,
    },
    {
      width: "1062",
      height: "300",
      title: "TW1 - Law",
      tooltip:
        "Realiza las tareas que le son asignadas dentro del grupo en los plazos requeridos.",
      srcJS: "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
      srcCSS: "",
      mode: WIDGET_CODE_SNIPPET,
      snippet:
        "var canvas = document.createElement('canvas');\
            canvas.id = 'canvas_%ID%';\
            canvas.width = '%WIDTH%';\
            canvas.style.width = '%WIDTH%';canvas.height = '%HEIGHT%'-70;canvas.style.height = '%HEIGHT%'-70;document.getElementById('content_%ID%').appendChild(canvas);\
            new Chart(document.getElementById('canvas_%ID%').getContext('2d'),\
              {\
                type: 'line',\
                options: {\
                  legend: {\
                    position:'left'\
                  },\
                },\
                data: {\
                  labels: %LABELS%,\
                  datasets: [\
                    {\
                      label: 'Law',\
                      borderColor: 'rgb(255, 99, 132)',\
				              backgroundColor: 'rgb(255, 99, 132)',\
                      fill: false,\
                      lineTension: 0,\
                      data: %VALUES%,\
                    }\
                  ]\
                }\
              });",
      field: "indicador1a",
      filter: {
        indicador1a: ["NOT BEGIN (undefined)"],
        tag: ["CONTAINS (Law)"],
      },
      calcFn: { fn: "countpercentage" },
      order: "ASC",
      sortBy: "key",
    },
    {
      width: "1062",
      height: "300",
      title: "TW1 - Architecture",
      tooltip:
        "Realiza las tareas que le son asignadas dentro del grupo en los plazos requeridos.",
      srcJS: "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
      srcCSS: "",
      mode: WIDGET_CODE_SNIPPET,
      snippet:
        "var canvas = document.createElement('canvas');\
            canvas.id = 'canvas_%ID%';\
            canvas.width = '%WIDTH%';\
            canvas.style.width = '%WIDTH%';canvas.height = '%HEIGHT%'-70;canvas.style.height = '%HEIGHT%'-70;document.getElementById('content_%ID%').appendChild(canvas);\
            new Chart(document.getElementById('canvas_%ID%').getContext('2d'),\
              {\
                type: 'line',\
                options: {\
                  legend: {\
                    position:'left'\
                  },\
                },\
                data: {\
                  labels: %LABELS%,\
                  datasets: [\
                    {\
                      label: 'Architecture',\
                      borderColor: 'rgb(255, 205, 86)',\
				              backgroundColor: 'rgb(255, 205, 86)',\
                      fill: false,\
                      lineTension: 0,\
                      data: %VALUES%,\
                    }\
                  ]\
                }\
              });",
      field: "indicador1a",
      filter: {
        indicador1a: ["NOT BEGIN (undefined)"],
        tag: ["CONTAINS (Architecture)"],
      },
      calcFn: { fn: "countpercentage" },
      order: "ASC",
      sortBy: "key",
    },
    {
      width: "1062",
      height: "300",
      title: "TW1 - Computer Tools",
      tooltip:
        "Realiza las tareas que le son asignadas dentro del grupo en los plazos requeridos.",
      srcJS: "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
      srcCSS: "",
      mode: WIDGET_CODE_SNIPPET,
      snippet:
        "var canvas = document.createElement('canvas');\
            canvas.id = 'canvas_%ID%';\
            canvas.width = '%WIDTH%';\
            canvas.style.width = '%WIDTH%';canvas.height = '%HEIGHT%'-70;canvas.style.height = '%HEIGHT%'-70;document.getElementById('content_%ID%').appendChild(canvas);\
            new Chart(document.getElementById('canvas_%ID%').getContext('2d'),\
              {\
                type: 'line',\
                options: {\
                  legend: {\
                    position:'left'\
                  },\
                },\
                data: {\
                  labels: %LABELS%,\
                  datasets: [\
                    {\
                      label: 'Computer Tools',\
                      borderColor: 'rgb(54, 162, 235)',\
				              backgroundColor: 'rgb(54, 162, 235)',\
                      fill: false,\
                      lineTension: 0,\
                      data: %VALUES%,\
                    }\
                  ]\
                }\
              });",
      field: "indicador1a",
      filter: {
        indicador1a: ["NOT BEGIN (undefined)"],
        tag: ["CONTAINS (Computer Tools)"],
      },
      calcFn: { fn: "countpercentage" },
      order: "ASC",
      sortBy: "key",
    },
    {
      width: "1062",
      height: "300",
      title: "TW2 - Law",
      tooltip:
        "Participa de forma activa en los espacios de encuentro del equipo, compartiendo la información, los conocimientos y las experiencias.",
      srcJS: "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
      srcCSS: "",
      mode: WIDGET_CODE_SNIPPET,
      snippet:
        "var canvas = document.createElement('canvas');\
            canvas.id = 'canvas_%ID%';\
            canvas.width = '%WIDTH%';\
            canvas.style.width = '%WIDTH%';canvas.height = '%HEIGHT%'-70;canvas.style.height = '%HEIGHT%'-70;document.getElementById('content_%ID%').appendChild(canvas);\
            new Chart(document.getElementById('canvas_%ID%').getContext('2d'),\
              {\
                type: 'line',\
                options: {\
                  legend: {\
                    position:'left'\
                  },\
                },\
                data: {\
                  labels: %LABELS%,\
                  datasets: [\
                    {\
                      label: 'Law',\
                      borderColor: 'rgb(255, 99, 132)',\
				              backgroundColor: 'rgb(255, 99, 132)',\
                      fill: false,\
                      lineTension: 0,\
                      data: %VALUES%,\
                    }\
                  ]\
                }\
              });",
      field: "indicador2a",
      filter: {
        indicador2a: ["NOT BEGIN (undefined)"],
        tag: ["CONTAINS (Law)"],
      },
      calcFn: { fn: "countpercentage" },
      order: "ASC",
      sortBy: "key",
    },
    {
      width: "1062",
      height: "300",
      title: "TW2 - Architecture",
      tooltip:
        "Participa de forma activa en los espacios de encuentro del equipo, compartiendo la información, los conocimientos y las experiencias.",
      srcJS: "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
      srcCSS: "",
      mode: WIDGET_CODE_SNIPPET,
      snippet:
        "var canvas = document.createElement('canvas');\
            canvas.id = 'canvas_%ID%';\
            canvas.width = '%WIDTH%';\
            canvas.style.width = '%WIDTH%';canvas.height = '%HEIGHT%'-70;canvas.style.height = '%HEIGHT%'-70;document.getElementById('content_%ID%').appendChild(canvas);\
            new Chart(document.getElementById('canvas_%ID%').getContext('2d'),\
              {\
                type: 'line',\
                options: {\
                  legend: {\
                    position:'left'\
                  },\
                },\
                data: {\
                  labels: %LABELS%,\
                  datasets: [\
                    {\
                      label: 'Architecture',\
                      borderColor: 'rgb(255, 205, 86)',\
				              backgroundColor: 'rgb(255, 205, 86)',\
                      fill: false,\
                      lineTension: 0,\
                      data: %VALUES%,\
                    }\
                  ]\
                }\
              });",
      field: "indicador2a",
      filter: {
        indicador2a: ["NOT BEGIN (undefined)"],
        tag: ["CONTAINS (Architecture)"],
      },
      calcFn: { fn: "countpercentage" },
      order: "ASC",
      sortBy: "key",
    },
    {
      width: "1062",
      height: "300",
      title: "TW2 - Computer Tools",
      tooltip:
        "Participa de forma activa en los espacios de encuentro del equipo, compartiendo la información, los conocimientos y las experiencias.",
      srcJS: "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
      srcCSS: "",
      mode: WIDGET_CODE_SNIPPET,
      snippet:
        "var canvas = document.createElement('canvas');\
            canvas.id = 'canvas_%ID%';\
            canvas.width = '%WIDTH%';\
            canvas.style.width = '%WIDTH%';canvas.height = '%HEIGHT%'-70;canvas.style.height = '%HEIGHT%'-70;document.getElementById('content_%ID%').appendChild(canvas);\
            new Chart(document.getElementById('canvas_%ID%').getContext('2d'),\
              {\
                type: 'line',\
                options: {\
                  legend: {\
                    position:'left'\
                  },\
                },\
                data: {\
                  labels: %LABELS%,\
                  datasets: [\
                    {\
                      label: 'Computer Tools',\
                      borderColor: 'rgb(54, 162, 235)',\
				              backgroundColor: 'rgb(54, 162, 235)',\
                      fill: false,\
                      lineTension: 0,\
                      data: %VALUES%,\
                    }\
                  ]\
                }\
              });",
      field: "indicador2a",
      filter: {
        indicador2a: ["NOT BEGIN (undefined)"],
        tag: ["CONTAINS (Computer Tools)"],
      },
      calcFn: { fn: "countpercentage" },
      order: "ASC",
      sortBy: "key",
    },
    {
      width: "1062",
      height: "300",
      title: "TW3 - Law",
      tooltip:
        "Colabora en la definición, la organización y distribución de las tareas de grupo.",
      srcJS: "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
      srcCSS: "",
      mode: WIDGET_CODE_SNIPPET,
      snippet:
        "var canvas = document.createElement('canvas');\
            canvas.id = 'canvas_%ID%';\
            canvas.width = '%WIDTH%';\
            canvas.style.width = '%WIDTH%';canvas.height = '%HEIGHT%'-70;canvas.style.height = '%HEIGHT%'-70;document.getElementById('content_%ID%').appendChild(canvas);\
            new Chart(document.getElementById('canvas_%ID%').getContext('2d'),\
              {\
                type: 'line',\
                options: {\
                  legend: {\
                    position:'left'\
                  },\
                },\
                data: {\
                  labels: %LABELS%,\
                  datasets: [\
                    {\
                      label: 'Law',\
                      borderColor: 'rgb(255, 99, 132)',\
				              backgroundColor: 'rgb(255, 99, 132)',\
                      fill: false,\
                      lineTension: 0,\
                      data: %VALUES%,\
                    }\
                  ]\
                }\
              });",
      field: "indicador3a",
      filter: {
        indicador3a: ["NOT BEGIN (undefined)"],
        tag: ["CONTAINS (Law)"],
      },
      calcFn: { fn: "countpercentage" },
      order: "ASC",
      sortBy: "key",
    },
    {
      width: "1062",
      height: "300",
      title: "TW3 - Architecture",
      tooltip:
        "Colabora en la definición, la organización y distribución de las tareas de grupo.",
      srcJS: "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
      srcCSS: "",
      mode: WIDGET_CODE_SNIPPET,
      snippet:
        "var canvas = document.createElement('canvas');\
            canvas.id = 'canvas_%ID%';\
            canvas.width = '%WIDTH%';\
            canvas.style.width = '%WIDTH%';canvas.height = '%HEIGHT%'-70;canvas.style.height = '%HEIGHT%'-70;document.getElementById('content_%ID%').appendChild(canvas);\
            new Chart(document.getElementById('canvas_%ID%').getContext('2d'),\
              {\
                type: 'line',\
                options: {\
                  legend: {\
                    position:'left'\
                  },\
                },\
                data: {\
                  labels: %LABELS%,\
                  datasets: [\
                    {\
                      label: 'Architecture',\
                      borderColor: 'rgb(255, 205, 86)',\
				              backgroundColor: 'rgb(255, 205, 86)',\
                      fill: false,\
                      lineTension: 0,\
                      data: %VALUES%,\
                    }\
                  ]\
                }\
              });",
      field: "indicador3a",
      filter: {
        indicador3a: ["NOT BEGIN (undefined)"],
        tag: ["CONTAINS (Architecture)"],
      },
      calcFn: { fn: "countpercentage" },
      order: "ASC",
      sortBy: "key",
    },
    {
      width: "1062",
      height: "300",
      title: "TW3 - Computer Tools",
      tooltip:
        "Colabora en la definición, la organización y distribución de las tareas de grupo.",
      srcJS: "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
      srcCSS: "",
      mode: WIDGET_CODE_SNIPPET,
      snippet:
        "var canvas = document.createElement('canvas');\
            canvas.id = 'canvas_%ID%';\
            canvas.width = '%WIDTH%';\
            canvas.style.width = '%WIDTH%';canvas.height = '%HEIGHT%'-70;canvas.style.height = '%HEIGHT%'-70;document.getElementById('content_%ID%').appendChild(canvas);\
            new Chart(document.getElementById('canvas_%ID%').getContext('2d'),\
              {\
                type: 'line',\
                options: {\
                  legend: {\
                    position:'left'\
                  },\
                },\
                data: {\
                  labels: %LABELS%,\
                  datasets: [\
                    {\
                      label: 'Computer Tools',\
                      borderColor: 'rgb(54, 162, 235)',\
				              backgroundColor: 'rgb(54, 162, 235)',\
                      fill: false,\
                      lineTension: 0,\
                      data: %VALUES%,\
                    }\
                  ]\
                }\
              });",
      field: "indicador3a",
      filter: {
        indicador3a: ["NOT BEGIN (undefined)"],
        tag: ["CONTAINS (Computer Tools)"],
      },
      calcFn: { fn: "countpercentage" },
      order: "ASC",
      sortBy: "key",
    },
    // {
    //   width: "1062",
    //   height: "300",
    //   title: "Indicador a mejorar",
    //   tooltip:
    //     "Gráfico circular que describe la distribución de las respuestas por indicador",
    //   srcJS: "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
    //   srcCSS: "",
    //   mode: WIDGET_CODE_SNIPPET,
    //   snippet:
    //     "var canvas = document.createElement('canvas');\
    //         canvas.id = 'canvas_%ID%';\
    //         canvas.width = '%WIDTH%';\
    //         canvas.style.width = '%WIDTH%';canvas.height = '%HEIGHT%'-70;canvas.style.height = '%HEIGHT%'-70;document.getElementById('content_%ID%').appendChild(canvas);\
    //         new Chart(document.getElementById('canvas_%ID%').getContext('2d'), \
    //         {type: 'pie',\
    //         options: {\
    //           tooltips: {bodyFontColor:'#FFFFFF',\
    //           bodyFontSize:14,\
    //           bodyFontStyle:'bold',\
    //           caretSize:0,\
    //           xPadding:0,\
    //           yPadding:0\
    //         },\
    //         responsive: false,\
    //         maintainAspectRatio:false,\
    //         legend: {\
    //           position:'left'\
    //         }\
    //       },\
    //       data: {\
    //         labels: %LABELS%,\
    //         datasets: [\
    //           {\
    //             data: %VALUES%,\
    //             backgroundColor:['rgb(255, 99, 132)','rgb(54, 162, 235)','rgb(255, 205, 86)','rgb(255, 0, 0)','rgb(0, 255, 0)','rgb(0, 0, 255)']\
    //           }\
    //         ]\
    //       }});",
    //   field: "indicador1a",
    //   filter: { indicador1a: ["NOT BEGIN (undefined)"] },
    // },
    {
      html:
        '<div class="widget section" style="flex-basis: 100%;">\
      <h2>4. Distribución de respuestas para Comunicación Oral:</h2>\
      <p>Información sobre las respuestas para la Comunicación Oral</p>\
      </div>',
      mode: WIDGET_TEXT,
    },
    {
      html:
        '<div class="widget section" style="flex-basis: 100%;">\
      <h2>5. MUSIC SCORE:</h2>\
      <p>Información sobre las distribuciones de Music Score por escuela</p>\
      </div>',
      mode: WIDGET_TEXT,
    },
    {
      html:
        '<div class="widget section" style="flex-basis: 100%;">\
      <h2>6. TAGS:</h2>\
      <p>Información sobre los tags</p>\
      </div>',
      mode: WIDGET_TEXT,
    },
    {
      html:
        '<div class="widget section" style="flex-basis: 100%;">\
      <h2>7. Autocorrelación lineal:</h2>\
      <p>Información sobre la autocorrelación lineal</p>\
      </div>',
      mode: WIDGET_TEXT,
    },
  ];

  widgets = widgets.concat(widgetsTemplate);

  /* SEMANA VISTA */
  /*
    for (let i = 0; i < 7; i++)
    {
      var dateOffset = (24*60*60*1000) * i; // i days
      var d = new Date();
      d.setTime(d.getTime() - dateOffset);

      let title = [{
        html:'<div style="flex-basis: 100%;">\
        <h1>Dashboard ' + d.toLocaleString() + '</h1>\
        </div>'
        ,mode:DASHBOARD_WIDGET_TEXT
      }];
      widgets = widgets.concat(title);

      // source: https://github.com/jashkenas/underscore/blob/master/underscore.js#L1320
      function isObject(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
      };
      function iterationCopy(src) {
        let target = {};
        for (let prop in src) {
          if (src.hasOwnProperty(prop)) {
            // if the value is a nested object, recursively copy all it's properties
            if (isObject(src[prop])) {
              target[prop] = iterationCopy(src[prop]);
            } else {
              target[prop] = src[prop];
            }
          }
        }
        return target;
      }


      let wtDates = [];
      for (let j = 1; j < widgetsTemplate.length; j++)
      {
        wtDates[j-1] = iterationCopy(widgetsTemplate[j]);
      }

      let filterDateFromTo = d.getFullYear()+''+((d.getMonth()+1<10)?('0'+(d.getMonth()+1)):(d.getMonth()+1))+''+((d.getDate()<10)?'0'+d.getDate():d.getDate());
      for (let k = 0; k < wtDates.length; k++)
      {
        wtDates[k].filter = {yearMonthDay:['>= ('+filterDateFromTo+') && <= ('+filterDateFromTo+')']};
      }
      
      widgets = widgets.concat(wtDates);
    }*/

  createWidgets(widgets);

  renderDashboard(widgets);
}

function checkRender() {
  let notLoaded = false;
  let numWidgetsLoaded = 0;
  let dashLoaderN = document.getElementById("loading-resources-n");
  let dashLoaderTotal = document.getElementById("loading-resources-total");
  let renderProgressBar = document.getElementById("my-progress");

  dashb.widgets.forEach((widget) => {
    if (
      WIDGET_JS_CSS_LOADING === widget.loaded ||
      WIDGET_JS_LOADED !== (widget.loaded & WIDGET_JS_LOADED) ||
      WIDGET_CSS_LOADED !== (widget.loaded & WIDGET_CSS_LOADED)
    ) {
      notLoaded = true;
    } else {
      numWidgetsLoaded++;
      moveProgressBar(
        renderProgressBar,
        numWidgetsLoaded,
        dashb.widgets.length
      );
    }
  });
  dashLoaderN.innerHTML = numWidgetsLoaded;
  if (notLoaded) {
    setTimeout(() => {
      checkRender();
    }, 500);
  } else {
    let dashLoaderMsg = document.getElementById("loading-resources-msg");

    dashLoaderMsg.innerHTML = "Rendering charts";
    dashLoaderTotal.innerHTML = dashb.widgets.length;
    dashLoaderN.innerHTML = "0";

    let renderPromise = new Promise((resolve, reject) => {
      setTimeout(function () {
        resolve();
      }, 250);
    });

    renderPromise.then(() => {
      render();
    });
  }
}

function render() {
  let dashLoaderN = document.getElementById("loading-resources-n");
  let dashLoaderTotal = document.getElementById("loading-resources-total");
  let dashLoader = document.getElementById("loading-resources");
  let renderProgressBar = document.getElementById("my-progress");

  if (parseInt(dashLoaderN.innerHTML) === 0) {
    renderProgressBar.style.width = 0;
  }

  dashb.widgets.forEach((widget) => {
    let renderPromise = new Promise((resolve, reject) => {
      setTimeout(function () {
        resolve();
      }, 250);
    });

    renderPromise.then(() => {
      dashb.renderWidget(widget, renderJSWidget, renderTextWidget);
      dashLoaderN.innerHTML = parseInt(dashLoaderN.innerHTML) + 1;
      if (dashLoaderTotal.innerHTML == dashLoaderN.innerHTML) {
        dashLoader.style.display = "none";
        navigatorInit("Show all students", "fullName");
        navigatorInit("Show all resources", "context");
        document.getElementById("widgets").style.opacity = 1;
      } else {
        moveProgressBar(
          renderProgressBar,
          parseFloat(dashLoaderN.innerHTML),
          parseFloat(dashLoaderTotal.innerHTML)
        );
      }
    });
  });
}

function navigatorInit(text, field) {
  if (null == document.getElementById("nav_" + field)) {
    let dataNavObj = {},
      dataNav = [];
    let navigator = document.getElementById("menu-navigator");
    dashb.msldb.logs.forEach((item) => {
      dataNavObj[item[field]] = 0;
    });

    for (let prop in dataNavObj) {
      dataNav.push(prop);
    }

    dataNav.sort();

    let stStr =
      '\
    <form id="nav_' +
      field +
      '" onsubmit="return false;">\
    <button class="btn small" onclick="let sel = this.form.elements[1]; if (sel.selectedIndex>0) {sel.selectedIndex-=1;sel.onchange();}"><i class="fas fa-chevron-left"></i></button>\
    <select style="max-width:250px" onchange="navigatorFilter(this.selectedIndex,this.options[this.selectedIndex].text,\'' +
      field +
      "');\">";
    stStr += "<option>" + text + "</option>";
    dataNav.forEach((item) => {
      stStr += "<option>" + item + "</option>";
    });
    stStr +=
      '</select><button class="btn small" onclick="let sel = this.form.elements[1]; if (sel.selectedIndex<sel.options.length-1) {sel.selectedIndex+=1;sel.onchange();}"><i class="fas fa-chevron-right"></i></button>\
    </form>';
    //if (null != document.getElementById("nav_" + field))
    //  document.getElementById("nav_" + field).remove();
    navigator.insertAdjacentHTML("beforeend", stStr);
  }
}

function renderJSWidget(widget) {
  if (widget.visible) {
    document
      .getElementById("widgets")
      .insertAdjacentHTML("beforeend", widget.evaluatedCSSHTML);
    widget.evalAndExecuteSnippet();
  }
}

function editJSWidget(widget) {
  if (widget.visible) {
    document.getElementById(widget.id).outerHTML = widget.evaluatedCSSHTML;
    //var replacement = document.createElement('lmn');
    //replacement.innerHTML = widget.evaluatedCSSHTML;
    //document.getElementById(widget.id).parentNode.replaceChild(replacement, document.getElementById(widget.id));
    //document.getElementById(widget.id).insertAdjacentHTML('beforeend', widget.evaluatedCSSHTML);
    widget.evalAndExecuteSnippet();
  }
}

function renderTextWidget(widget) {
  if (widget.visible) {
    document
      .getElementById("widgets")
      .insertAdjacentHTML("beforeend", widget.evaluatedCSSHTML);
  }
}

function displayFileContents(contents, visible = true) {
  var element = document.getElementById("file-content");
  element.style.display = visible ? "block" : "none";
  if (undefined !== contents) {
    element.innerHTML = contents;
  }
}

function globalFilter() {
  let fieldsList = [];
  for (let prop in dashb.msldb.logs[0]) {
    fieldsList[fieldsList.length] = prop;
  }

  let filterList = [
    "IN",
    "CONTAINS",
    "BEGIN WITH",
    "END WITH",
    "BETWEEN",
    "BETWEENEQ",
    "EQUAL TO",
    "NOTEQUAL TO",
    "LESS THAN",
    "LESSEQ TAHN",
    "GREATER THAN",
    "GREATEREQ THAN",
  ];

  let typeList = ["string", "number", "date"];

  dashb.modal.headerContent = '<i class="fas fa-filter"></i>Global filter';

  dashb.modal.content =
    '\
    <form onsubmit="return false;">\
      <!--<div>\
        <input type="checkbox" >\
        <label for="meeting-time" style="display:inline-block;width:200px">From date & time:</label>\
        <input type="datetime-local" id="meeting-time"\
           name="meeting-time" value="2018-06-12T19:30"></input>\
      </div>\
      <div>\
        <input type="checkbox" >\
        <label for="meeting-time" style="display:inline-block;width:200px">To date & time:</label>\
        <input type="datetime-local" id="meeting-time"\
           name="meeting-time" value="2018-06-12T19:30"></input>\
      </div>-->\
      <div>\
        <select>' +
    fieldsList.map((field) => {
      return "<option>" + field + "</option>";
    }) +
    "</select>\
        &nbsp;\
        <select>" +
    filterList.map((filter) => {
      return "<option>" + filter + "</option>";
    }) +
    "</select>\
        &nbsp;\
        <select>" +
    typeList.map((type) => {
      return "<option>" + type + "</option>";
    }) +
    '</select>\
      </div>\
      <div>\
        <button onclick="updateGlobalFilter(this.form);">Update global filter</button>\
      </div>\
    </form>';

  dashb.modal.show();
}

function newWidget() {
  let fieldsList = [];
  for (let prop in dashb.msldb.logs[0]) {
    fieldsList[fieldsList.length] = prop;
  }

  dashb.modal.headerContent = '<i class="fas fa-plus"></i>New widget';

  dashb.modal.content =
    '\
  <form onsubmit="return false;">\
    <div>\
      <select>' +
    fieldsList.map((field) => {
      return "<option>" + field + "</option>";
    }) +
    '</select>\
    </div>\
    <div>\
      <button onclick="updateGlobalFilter(this.form);">Add chart</button>\
    </div>\
  </form>';

  dashb.modal.show();
}

function dateFilter() {
  let dates = getDateFilter();

  dashb.modal.headerContent =
    '<i class="fas fa-calendar-alt"></i>&nbsp;Date filter';

  dashb.modal.content =
    '\
  <form onsubmit="return false;">\
    <div>\
      <label for="dateWidgetFrom" style="display:inline-block;width:200px">From date:</label>\
      <input type="date" id="dateWidgetFrom"\
        name="dateWidgetFrom" value="' +
    dates[0] +
    '"></input>\
    </div>\
    <div>&nbsp;</div>\
    <div>\
      <label for="dateWidgetTo" style="display:inline-block;width:200px">To date:</label>\
      <input type="date" id="dateWidgetTo"\
        name="dateWidgetTo" value="' +
    dates[1] +
    '"></input>\
    </div>\
    <div>&nbsp;</div>\
    <div>\
      <button class="btn" onclick="updateDateFilter(this.form.dateWidgetFrom.value, this.form.dateWidgetTo.value);">Update dates</button>\
    </div>\
  </form>';

  dashb.modal.show();
}

function editWidget(id) {
  let widget = dashb.getWidgetById(id);
  dashb.modal.headerContent = widget.title;

  dashb.modal.content =
    '\
    <form onsubmit="return false;">\
      <p>Title</p>\
      <div>\
        <input name="title" type="text" value="' +
    widget._title +
    '">\
      </div>\
      <p>Size</p>\
      <div>\
        <input name="size" type="number" value="' +
    widget._size +
    '">\
      </div>\
      <p>Template</p>\
      <div id="editor-template" class="codemirror-editor">\
        <textarea name="codeditor-template" id="codeditor-template" style="display: none;">' +
    widget._html +
    '</textarea>\
      </div>\
      <p>JavaScript Snippet</p>\
      <div id="editor-js" class="codemirror-editor">\
        <textarea name="codeditor-js" id="codeditor-js" style="display: none;">' +
    widget._snippet +
    "</textarea>\
      </div>\
      <div>\
        <button onclick=\"updateWidget('" +
    id +
    "', this.form);\">Update widget</button>\
        <button onclick=\"deleteWidget('" +
    id +
    "');\">Delete widget</button>\
      </div>\
    </form>";

  dashb.modal.show();

  // Initialize mirror code editor
  let editorTemplate = CodeMirror.fromTextArea(
    document.getElementById("codeditor-template"),
    {
      lineNumbers: true,
      mode: "htmlmixed",
    }
  );

  // Initialize mirror code editor
  let editorJS = CodeMirror.fromTextArea(
    document.getElementById("codeditor-js"),
    {
      lineNumbers: true,
      mode: "htmlmixed",
    }
  );

  // Try to format
  //var totalLines = editor.lineCount();
  //editor.autoFormatRange({line:0, ch:0}, {line:totalLines});
}

function deleteWidget(id) {
  let widget = dashb.getWidgetById(id);
  dashb.widgets.splice(widget._index, 1);

  document.getElementById(widget.id).outerHTML = "";

  dashb.modal.close();
}

function updateWidget(id, form) {
  let widget = dashb.getWidgetById(id);
  widget._size = form.elements["size"].value;
  widget._title = form.elements["title"].value;
  widget._html = form.elements["codeditor-template"].value;
  widget._snippet = form.elements["codeditor-js"].value;

  dashb.modal.close();

  dashb.renderWidget(widget, editJSWidget, function () {});
}

function schema(item) {
  let fields;
  if (item) {
    if (item.hasOwnProperty(COTRAMOKEYS.FULLDATE)) {
      // if first day of month is < 10 then add 0
      if ("/" === item[COTRAMOKEYS.FULLDATE].substr(1, 1)) {
        item[COTRAMOKEYS.FULLDATE] = "0" + item[COTRAMOKEYS.FULLDATE];
      }
      if ("/" === item[COTRAMOKEYS.FULLDATE].substr(4, 1)) {
        item[COTRAMOKEYS.FULLDATE] =
          item[COTRAMOKEYS.FULLDATE].substr(0, 3) +
          "0" +
          item[COTRAMOKEYS.FULLDATE].substr(3, 15);
      }
      fields = {
        fullDate: item[COTRAMOKEYS.FULLDATE],
        yearMonthDay:
          item[COTRAMOKEYS.FULLDATE].substr(6, 4) +
          "" +
          item[COTRAMOKEYS.FULLDATE].substr(0, 2) +
          "" +
          item[COTRAMOKEYS.FULLDATE].substr(3, 2),
        yearMonthDayHourMinute:
          item[COTRAMOKEYS.FULLDATE].substr(6, 4) +
          "" +
          item[COTRAMOKEYS.FULLDATE].substr(0, 2) +
          "" +
          item[COTRAMOKEYS.FULLDATE].substr(3, 2) +
          "" +
          item[COTRAMOKEYS.FULLDATE].substr(11, 2) +
          "" +
          item[COTRAMOKEYS.FULLDATE].substr(14, 2),
        consentimiento:
          item[COTRAMOKEYS.CONSENTIMIENTO] === "Sí" ||
          item[COTRAMOKEYS.CONSENTIMIENTO] === "YES"
            ? true
            : false,
        dni: item[COTRAMOKEYS.DNI],
        tag: item[COTRAMOKEYS.TAG],
        center: item[COTRAMOKEYS.CENTER],
        indicador1a: item[COTRAMOKEYS.INDICADOR_1A],
        indicador2a: item[COTRAMOKEYS.INDICADOR_2A],
        indicador3a: item[COTRAMOKEYS.INDICADOR_3B],
        mayorPosMejoraIndicadorA:
          item[COTRAMOKEYS.MAYOR_POS_MEJORA_INDICADOR_A],
        planMejoraIndicadorA: item[COTRAMOKEYS.PLAN_MEJOR_INDICADOR_A],
        indicador1b: item[COTRAMOKEYS.INDICADOR_1B],
        indicador2b: item[COTRAMOKEYS.INDICADOR_2B],
        indicador3b: item[COTRAMOKEYS.INDICADOR_3B],
        mayorPosMejoraIndicadorB:
          item[COTRAMOKEYS.MAYOR_POS_MEJORA_INDICADOR_B],
        planMejoraIndicadorB: item[COTRAMOKEYS.PLAN_MEJOR_INDICADOR_B],
        actividadesUtiles: item[COTRAMOKEYS.ACTIVIDADES_UTILES],
        capacidadRealizacionAct: item[COTRAMOKEYS.CAPACIDAD_REALIZACION],
        metodosEnsenanza: item[COTRAMOKEYS.METODOS_ENSENANZA],
        disfrutarActividades: item[COTRAMOKEYS.DISFRUTAR_ACTIVIDAD],
        capacidadAltaCalificacion: item[COTRAMOKEYS.CAPACIDAD_CALIFICACION],
        controlAprendizaje: item[COTRAMOKEYS.CONTROL_APRENDIZAJE],
        preocupacionProfe: item[COTRAMOKEYS.PREOCUPACION_PROFESOR],
        conocimientoFuturo: item[COTRAMOKEYS.CONOCIMIENTO_FUTURO],
        profeAmigable: item[COTRAMOKEYS.PROFESOR_AMIGABLE],
      };
    } else if (Object.prototype.hasOwnProperty.call(item, "fullDate")) {
      fields = item;
    } else if (item[0]) {
      // if first day of month is < 10 then add 0
      if ("/" === item[0].substr(1, 1)) {
        item[0] = "0" + item[0];
      }
      fields = {
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
        timestamp:
          Date.parse(
            item[0].substr(6, 4) +
              "-" +
              item[0].substr(3, 2) +
              "-" +
              item[0].substr(0, 2) +
              "T" +
              item[0].substr(11, 2) +
              ":" +
              item[0].substr(14, 2) +
              ":00"
          ) / 1000,
        user: item[1],
        name: item[1].split(" ")[0],
        middleName: item[1].split(" ")[item[1].split(" ").length - 2],
        lastName: item[1].split(" ")[item[1].split(" ").length - 1],
        affectedUser: item[2],
        context: item[3],
        component: item[4],
        event: item[5],
        description: item[6],
        origin: item[7],
        ip: item[8],
      };
      fields.fullName =
        fields.middleName + " " + fields.lastName + ", " + fields.name;
      fields.fullNameDePersonalized = fields.fullName.dePersonalize();
    }
  }
  return fields;
}

function filters() {
  return {
    IN: {
      regex: /^IN [(](.*)[)]/gm,
      fn: (r, v) => {
        return r.toLowerCase() == v.toLowerCase();
      },
    },
    CONTAINS: {
      regex: /CONTAINS [(](.*)[)]/gm,
      fn: (r, v) => {
        return -1 < r.toLowerCase().indexOf(v.toLowerCase());
      },
    },
    BEGIN: {
      regex: /BEGIN [(](.*)[)]/gm,
      fn: (r, v) => {
        return 0 == r.toLowerCase().indexOf(v.toLowerCase());
      },
    },
    END: {
      regex: /END [(](.*)[)]/gm,
      fn: (r, v) => {
        return r.length - v.length == r.toLowerCase().indexOf(v.toLowerCase());
      },
    },
    BETWEEN: {
      regex: /BETWEEN [(](.*)[)]/gm,
      fn: (r, v1, v2) => {
        return r > v1 && r < v2;
      },
    },
    BETWEENEQ: {
      regex: /BETWEENEQ [(](.*)[)]/gm,
      fn: (r, v1, v2) => {
        return r >= v1 && r <= v2;
      },
    },
    EQUAL: {
      regex: /== [(](.*)[)]/gm,
      fn: (r, v) => {
        return r == v;
      },
    },
    NOTEQUAL: {
      regex: /!= [(](.*)[)]/gm,
      fn: (r, v) => {
        return r != v;
      },
    },
    LESS: {
      regex: /< [(](.*)[)]/gm,
      fn: (r, v) => {
        return r < v;
      },
    },
    LESSEQ: {
      regex: /<= [(](.*)[)]/gm,
      fn: (r, v) => {
        return r <= v;
      },
    },
    GREATER: {
      regex: /> [(](.*)[)]/gm,
      fn: (r, v) => {
        return r > v;
      },
    },
    GREATEREQ: {
      regex: /> [(](.*)[)]/gm,
      fn: (r, v) => {
        return r >= v;
      },
    },
  };
}

function loadDashboard() {
  // File handling
  /** @type {FileHandler} */
  let fileHandler = new FileHandler({
    callback: fillDashboard,
    fileInput: document.getElementById("load-file-input"),
  });
  fileHandler.setHandlers();
  document.getElementById("load-file-input").click();
}

function saveDashboard() {
  let fileName = "dashboard";
  dashb.download(fileName);
}

function loadApp() {
  // File handling
  /** @type {FileHandler} */
  let fileHandler = new FileHandler({
    callback: changeInputFile,
    dropArea: document.getElementById("drop-area"),
    fileInput: document.getElementById("file-input"),
    classHighlight: "highlight",
  });
  fileHandler.setHandlers();

  // dashboard initialization
  dashb.init();

  // date filter
  renderDateFilter();
}

function renderDateFilter() {
  let dateFilter = document.getElementById("date-filter");
  let regex = /BETWEENEQ [(](.*)[)]/gm;
  if ((m = regex.exec(dashb.msldb.widgetFilter.yearMonthDay)) !== null) {
    let values = m[1].split(",");
    dateFilter.innerHTML =
      YMDToDate(values[0]).toLocaleDateString() +
      " - " +
      YMDToDate(values[1]).toLocaleDateString();
  }
}

function getDateFilter() {
  let regex = /BETWEENEQ [(](.*)[)]/gm;
  if ((m = regex.exec(dashb.msldb.widgetFilter.yearMonthDay)) !== null) {
    let values = m[1].split(",");
    values[0] =
      values[0].substr(0, 4) +
      "-" +
      values[0].substr(4, 2) +
      "-" +
      values[0].substr(6, 2);
    values[1] =
      values[1].substr(0, 4) +
      "-" +
      values[1].substr(4, 2) +
      "-" +
      values[1].substr(6, 2);
    return values;
  }
  return [];
}

function updateDateFilter(from, to) {
  dashb.msldb.widgetFilter.yearMonthDay = [
    "BETWEENEQ (" + from.replace(/-/g, "") + "," + to.replace(/-/g, "") + ")",
  ];
  renderDateFilter();
  dashb.modal.close();
  reRenderDashboard();
}

window[addEventListener ? "addEventListener" : "attachEvent"](
  addEventListener ? "load" : "onload",
  loadApp
);
