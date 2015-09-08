"use strict";

const API_ROOT = "http://www.easylink.io/v1/";
var _userToken, _appId;

export function init(appId, userToken) {
  _userToken = userToken;
  _appId = appId;
}

function api(url, options) {
  var p = new Promise(function (resolve, reject) {
    $.ajax({
      url: API_ROOT + url,
      type: options.method,
      data: options.data,
      beforeSend: function(request) {
          request.setRequestHeader("Authorization", "token " + _userToken);
          request.setRequestHeader("X-Application-Id", _appId);
      },
      success: function(response){
        resolve(response);
      },
      error: function(e){
        reject(e);
      }
    });
  });
  return p;
}

export function deviceGet(param) {
  var options = {
    method: "post",
    data: param,
  }
  return api('device/get', options);
}

export function secret_key(param) {
  var options = {
    method: "post",
    data: param,
  }
  return api('device/authorize/secret_key', options);
}
