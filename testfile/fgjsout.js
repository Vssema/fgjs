/**
 * FogCloud api by Rcoke 
 * 2015-09-08
 */
'use strict';
var Promise = require("promise");
var md5 = require("md5");
var FG = exports = {};
var _appId = "";
var _appSecret = "";
var _version = "";
var _userToken = "";
var _userID = "";

var end_point = "http://www.easylink.io/";
var _urlhead = "";

var urls1 = {
    "user/applyResetpassword": "post",
    "user/changepassword": "post",
    "user/join": "post",
    "user/login": "post",
    "user/resetpassword": "post",
    "user/revalidate": "post",
    "user/validate": "post",

    "key/authorize": "post",
    "key/user/authorize": "post",

    "device/find": "post",
    "device/devices": "post",
    "device/modify": "post",
    "device/authorization/devices": "post",
    "device/user/delete": "post",
    "device/user/query": "post",
    "device/delete": "post",

    "authorization/authorize": "post"
};

var urls2 = {
    "users/tokens": "get",
    "users": "post",
    "users/device/unbind": "post",
    "users/email_verification_code": "post",
    "users/login": "post",
    "users/password/reset": "post",
    "users/sms_verification_code": "post",
    "users/password": "put",

    "devices/get": "get",
    "devices/users": "get",
    "devices/modify": "put",

    "authorization/devices": "get",
    "authorization/devices/manage": "post"
};

//if the method is get change data to url
var _eachData = function(data) {
    var geturl = "";
    for (var key in data) {
        geturl += key + "=" + data[key] + "&";
    }
    return geturl;
};

//the function of ajax
var _ajax = function(method, url, data) {
    var timestamp = Date.parse(new Date());
    console.log(md5(_appSecret + timestamp) + "," + timestamp);
    var p = new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        if ("get" == method) {
            url = url + "?" + _eachData(data);
        } else if ("delete" == method) {
            url = url + "?" + _eachData(data);
        }
        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("X-Application-Id", _appId);
        xhr.setRequestHeader("Authorization", "token " + _userToken);
        xhr.setRequestHeader("X-Request-Sign", md5(_appSecret + timestamp) + "," + timestamp);
        xhr.send(JSON.stringify(data));
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        resolve(JSON.parse(xhr.responseText));
                    } catch (e) {
                        reject(JSON.parse(xhr.responseText));
                    }
                } else {
                    reject(JSON.parse(xhr.responseText));
                }
            }
        };
    });
    return p;
};

//Change the name to function name
var _changeName = function(name) {
    var namelist = name.split("");
    var xxzm = namelist[(name.indexOf("/")) + 1];
    var dxzm = xxzm.toUpperCase();

    var finalName = name.replace("/" + xxzm, dxzm);


    if (finalName.indexOf("/") > 0) {
        return _changeName(finalName);
    } else {
        return finalName;
    }
};

//init user information
FG.init = function(appId, appSecret, version) {
    _appId = appId;
    _appSecret = appSecret;
    if (typeof version != "undefined") {
        _version = version.toLowerCase();
    } else {
        _version = "v2";
    }

    //make anonymous functions
    _urlhead = end_point + _version + "/";

    var urllist;
    if ("v1" == _version) {
        urllist = urls1;
    } else if ("v2" == _version) {
        urllist = urls2;
    }

    for (var k in urllist) {
        var fk = _changeName(k);
        FG[fk] = (function(url, method) {
            return function(param) {
                return _ajax(method, _urlhead + url, param);
            }
        })(k, urllist[k]);
    }
};

FG.login = function(param) {
    var loginAjax;
    if ("v1" == _version) {
        loginAjax = FG.userLogin(param);
        loginAjax.then(function(ret) {
            _userToken = ret.token;
            _userID = ret.login_id;
        }, function(err) {});
    } else if ("v2" == _version) {
        loginAjax = FG.usersLogin(param);
        loginAjax.then(function(ret) {
            _userToken = ret.user_token;
            _userID = ret.user_id;
        }, function(err) {});
    }
    return loginAjax;
};

FG.getUserInfo = function() {
    var method = "get";
    var url = "users/info";
    var param = "";
    return _ajax(method, _urlhead + url, param);
};

FG.putUserInfo = function(param) {
    var method = "put";
    var url = "users/info";
    return _ajax(method, _urlhead + url, param);
};

FG.deleteDevicesUsers = function(param) {
    var method = "delete";
    var url = "devices/users";
    return _ajax(method, _urlhead + url + "/" + param.user_id + "?device_id=" + param.device_id, param);
};

global.FG = FG;
