
var _globalGISUrl = "http://52.247.167.253/jagis/";
var _globalESRIUrl = "http://js.arcgis.com/3.18/";
window.apiUrl = "http://js.arcgis.com/3.18/";
window.path = "http://52.247.167.253/jagis/";
var _globalGeocodeServerUrl = "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer";
var _globalGeometryServerUrl = "http://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer";
var _globalServiceAreaTaskUrl="http://route.arcgis.com/arcgis/rest/services/World/ServiceAreas/NAServer/ServiceArea_World";
var _logLevel="";
///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////


(function(global){

  //load js, css files
  function loadResources(ress, onOneBeginLoad, onOneLoad, onLoad){
    var loaded = [];
    function _onOneLoad(url){
      //to avoid trigger onload more then one time
      if(checkHaveLoaded(url)){
        return;
      }
      loaded.push(url);
      if(onOneLoad){
        onOneLoad(url, loaded.length);
      }
      if(loaded.length === ress.length){
        if(onLoad){
          onLoad();
        }
      }
    }

    for(var i = 0; i < ress.length; i ++){
      loadResource(ress[i], onOneBeginLoad, _onOneLoad);
    }

    function checkHaveLoaded(url){
      for(var i = 0; i < loaded.length; i ++){
        if(loaded[i] === url){
          return true;
        }
      }
      return false;
    }
  }



  function getExtension(url) {
    url = url || "";
    var items = url.split("?")[0].split(".");
    return items[items.length-1].toLowerCase();
  }

  function loadResource(url, onBeginLoad, onLoad){
    if(onBeginLoad){
      onBeginLoad(url);
    }
    var type = getExtension(url);
    if(type.toLowerCase() === 'css'){
      loadCss(url);
    }else{
      loadJs(url);
    }

    function createElement(config) {
      var e = document.createElement(config.element);
      for (var i in config) {
        if (i !== 'element' && i !== 'appendTo') {
          e[i] = config[i];
        }
      }
      var root = document.getElementsByTagName(config.appendTo)[0];
      return (typeof root.appendChild(e) === 'object');
    }

    function loadCss(url) {
      var result = createElement({
        element: 'link',
        rel: 'stylesheet',
        type: 'text/css',
        href: url,
        onload: function(){
          elementLoaded(url);
        },
        appendTo: 'head'
      });

      //for the browser which doesn't fire load event
      //safari update documents.stylesheets when style is loaded.
      var ti = setInterval(function() {
        var styles = document.styleSheets;
        for(var i = 0; i < styles.length; i ++){
          // console.log(styles[i].href);
          if(styles[i].href &&
            styles[i].href.substr(styles[i].href.indexOf(url), styles[i].href.length) === url){
            clearInterval(ti);
            elementLoaded(url);
          }
        }
      }, 500);
      
      return (result);
    }

    function loadJs(url) {
      var result = createElement({
        element: 'script',
        type: 'text/javascript',
        onload: function(){
          elementLoaded(url);
        },
        onreadystatechange: function(){
          elementReadyStateChanged(url, this);
        },
        src: url,
        appendTo: 'body'
      });
      return (result);
    }

    function elementLoaded(url){
      if(onLoad){
        onLoad(url);
      }
    }
    function elementReadyStateChanged(url, thisObj){
      if (thisObj.readyState === 'loaded' || thisObj.readyState === 'complete') {
        elementLoaded(url);
      }
    }
  }

  
  function testLoad(testObj){
    testObj.success = !!testObj.success? isArray(testObj.success)?
      testObj.success: [testObj.success]: [];
    testObj.failure = !!testObj.failure?
      isArray(testObj.failure)? testObj.failure: [testObj.failure]: [];

    if(testObj.test && testObj.success.length > 0){
      loadResources(testObj.success, null, null, testObj.callback);
    }else if(!testObj.test && testObj.failure.length > 0){
      loadResources(testObj.failure, null, null, testObj.callback);
    }else{
      testObj.callback();
    }
  }

  /* A must read: http://bonsaiden.github.com/JavaScript-Garden
     ************************************************************/
  function is(type, obj) {
    var clas = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && obj !== null && clas === type;
  }

  function isArray(item) {
    return is("Array", item);
  }

  global.loadResources = loadResources;
  global.loadResource = loadResource;
  global.testLoad = testLoad;
}
)(window);
var dojoConfig;
(function (global) {
    var resources = [];
    if (window.location.protocol === 'https:') {
        var reg = /^http:\/\//i;
        if (reg.test(window.apiUrl)) {
            window.apiUrl = window.apiUrl.replace(reg, 'https://');
        }
        if (reg.test(window.path)) {
            window.path = window.path.replace(reg, 'https://');
        }
    }

    /*jshint unused:false*/
    dojoConfig = {
        parseOnLoad: false,
        async: true,
        tlmSiblingOfDojo: false,
        has: {
            'extend-esri': 1
        }
    };

    resources = resources.concat([window.apiUrl + 'dijit/themes/claro/claro.css', window.apiUrl + 'esri/css/esri.css', window.apiUrl + 'dojox/layout/resources/ResizeHandle.css', ]);
    dojoConfig.baseUrl = window.apiUrl + 'dojo';

    dojoConfig.locale = "en";
    dojoConfig.parseOnLoad = true;
    dojoConfig.async = true;
    dojoConfig.tlmSiblingOfDojo = false;
    dojoConfig.has = {
        'extend-esri': 1,
        "dojo-firebug": true,
        "dojo-debug-messages": true
    };
    dojoConfig.aliases = [["AGIS", "AGISAPI/Main"]];
    dojoConfig.parseOnLoad = false;
    dojoConfig.packages = [{
        name: "widgets",
        location: _globalGISUrl + "widgets"
    },
    {
        name: "AGISAPI",
        location: _globalGISUrl + "AccelaJS/AGISModules"
    },
    {
        name: "themes",
        location: _globalGISUrl + "themes"
    },
    {
        name: "UTest",
        location: _globalGISUrl + "UnitTest/Jasmine"
    }];
    // Timeout after 10 seconds
    //waitSeconds: 10,
    dojoConfig.map = {
        // Instead of having to type "dojo/domReady!", we just want "ready!" instead
        "*": {
            ready: "dojo/domReady"
        }
    };
    // Get "fresh" resources
    dojoConfig.cacheBust = false;
    dojoConfig.isDebug = false;

    //resources.push(window.apiUrl + 'init.js');
    resources.push(_globalGISUrl + '3.18/Scripts/init.js');

    function AGISMap(container, option) {
        option.lang = option.lang.toLowerCase();
        AGISMap.delaylist = [];
        AGISMap.option = option;
        dojoConfig.locale = convertLang(option.lang);
        AGISMap.container = container;
        if (!AGISMap.instance) {
            loadResources(resources, null,
            function (url, loaded) {
                if (typeof loadingCallback === 'function') {
                    loadingCallback(url, loaded, resources.length);
                }
            },
            function () {
                continueLoad();
                function continueLoad() {
                    if (typeof require === 'undefined') {
                        if (window.console) {
                            console.log('Waiting for API loaded.');
                        }
                        setTimeout(continueLoad, 100);
                        return;
                    }
                }

                require(['AGIS'],
                function (Map) {
                    AGISMap.instance = Map;
                    AGISMap.previousCon = AGISMap.container;
                    Map.initMap(AGISMap.container, AGISMap.option);
                    if (AGISMap.delaylist.length > 0) {
                        var count = AGISMap.delaylist.length;
                        for (var i = count - 1; i >= 0; i--) {
                            AGISMap.delaylist[i]();
                            AGISMap.delaylist.pop();
                        }
                    }
                });
            });
        }else {
            require(['AGIS', 'dojo/query', 'dojo/dom-construct'],
              function (Map, query, domCon) {

                  if (AGISMap.previousCon) {
                      //query(".accelajs-widgets-icon").forEach(domCon.destroy);
                      query(".accelajs-widgets").forEach(domCon.destroy);
                      if (AGISMap.container !== AGISMap.previousCon) {
                          domCon.destroy(AGISMap.previousCon);
                      }
                  }

                  AGISMap.instance = Map;
                  Map.initMap(AGISMap.container, AGISMap.option);
                  if (AGISMap.delaylist.length > 0) {
                      var count = AGISMap.delaylist.length;
                      for (var i = count - 1; i >= 0; i--) {
                          AGISMap.delaylist[i]();
                          AGISMap.delaylist.pop();
                      }
                  }
              });
        }
    };
    AGISMap.prototype.locate = function (data, fun) {
        var locate = function () {
            AGISMap.instance.locate(data, fun);
        };
        if (!AGISMap.instance) {
            AGISMap.delaylist.push(locate);
        } else {
            locate();
        }
    };

    AGISMap.prototype.highlight = function (data) {
        var highlight = function () {
            AGISMap.instance.highlight(data);
        };
        if (!AGISMap.instance) {
            AGISMap.delaylist.push(highlight);
        } else {
            highlight();
        }
    };

    AGISMap.prototype.highLightObject = function (data) {
        var highLightObject = function () {
            AGISMap.instance.highLightObject(data);
        };
        if (!AGISMap.instance) {
            AGISMap.delaylist.push(highLightObject);
        } else {
            highLightObject();
        }
    };

    AGISMap.prototype.removeHighLightObject = function (data) {
        var removeHighLightObject = function () {
            AGISMap.instance.removeHighLightObject(data);
        };
        if (!AGISMap.instance) {
            AGISMap.delaylist.push(removeHighLightObject);
        } else {
            removeHighLightObject();
        }
    };


    AGISMap.prototype.addEventListener = function (key, fun, params) {
        var listener = function () {
            AGISMap.instance.addEventListener(key, fun, params);
        };
        if (!AGISMap.instance) {
            AGISMap.delaylist.push(listener);
        } else {
            listener();
        }
    };

    AGISMap.prototype.showRecordPanel = function (data) {
        var showRecordPanel = function () {
            AGISMap.instance.showRecordPanel(data);
        };
        if (!AGISMap.instance) {
            AGISMap.delaylist.push(showRecordPanel);
        } else {
            showRecordPanel();
        }
    };
    AGISMap.prototype.getGISObjectdetails = function (data) {
        var getGISObjectdetails = function () {
            AGISMap.instance.getGISObjectdetails(data);
        };
        if (!AGISMap.instance) {
            AGISMap.delaylist.push(getGISObjectdetails);
        }
        else {
            getGISObjectdetails();
        }
    };
    AGISMap.prototype.showGisObjPanel = function () {
        var showGisObjPanel = function () {
            AGISMap.instance.showGisObjPanel();
        };
        if (!AGISMap.instance) {
            AGISMap.delaylist.push(showGisObjPanel);
        } else {
            showGisObjPanel();
        }
    };

    //Convert AA/ACA language to AGIS language
    function convertLang(lang) {
        var agisLang = '';
        switch (lang) {
            case 'ar_ae':
                agisLang = 'ar';
                break;
            case 'zh_tw':
                agisLang = 'zh-tw';
                break;
            case 'zh_cn':
                agisLang = 'zh-cn';
                break;
            case 'es_mx':
                agisLang = 'es';
                break;
            case 'fr_ca':
                agisLang = 'fr';
                break;
            case 'pt_pt':
                agisLang = 'pt-pt';
                break;
            case 'vi_vn':
                agisLang = 'vi';
                break;
            default:
                agisLang = lang;
                break;
        }
        return agisLang;
    }

    String.prototype.GISFormat = String.prototype.GISFormat ||
        function () {
            "use strict";
            var str = this.toString();
            if (arguments.length) {
                var t = typeof arguments[0];
                var key;
                var args = ("string" === t || "number" === t) ?
                    Array.prototype.slice.call(arguments)
                    : arguments[0];

                for (key in args) {
                    str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
                }
            }
            return str;
        };

    global.AGISMap = AGISMap;

})(window);
