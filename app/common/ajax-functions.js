'use strict';

var appUrl = window.location.origin;
var ajaxFunctions = {
   ready: function ready (fn) {
      if (typeof fn !== 'function') {
         return;
      }

      if (document.readyState === 'complete') {
         return fn();
      }

      document.addEventListener('DOMContentLoaded', fn, false);
   },
   ajaxRequest: function ajaxRequest (method, url, callback, errorCb) {
      var xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function () {
         if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            callback(xmlhttp.response);
         } else if (xmlhttp.readyState === 4 && xmlhttp.status !== 200){
            if(errorCb)
               errorCb(xmlhttp.response);
         }
      };

      xmlhttp.open(method, url, true);
      xmlhttp.send();
   },
   ajaxByObj: function ajaxByObj (req) {
      const url = req.url;
      const method = req.method || 'get';
      const successCallback = req.success;
      const errorCallback = req.error;
      const contentType = req.contentType || "application/x-www-form-urlencoded";
      const dataType = req.dataType || 'json';
      const payload = req.payload || ''; 
      let xhr = new XMLHttpRequest();
      xhr.open(method, url)
      xhr.setRequestHeader("Content-type", contentType)
      xhr.responseType = dataType
      xhr.onload = function () {
         let _this = this
         if (this.status == 200) {
            successCallback(_this.response)
         } else {
            errorCallback(_this.response)
         }
      }
      xhr.send(payload)
   }
};