/**
* FogCloud api by Rcoke 
* 2015-09-08
*/
/**
遗留问题：
1、login时候返回userid
2、解绑某个用户
3、解绑自己和设备的关系
4、其他delete的接口
*/
'use strict';
var Promise = require("promise");
var md5 = require("md5");
var FG = exports = {};
// const API_ROOT = "http://www.easylink.io/v1/";
var _userToken, _appId, _appSecret;

var end_point = "http://www.easylink.io/v2/";
// console.log(md5('message'));
var urls = {
    "users/info" : "get",
    "users/tokens" : "get",
    "users" : "post",
    "users/device/unbind" : "post",
    "users/email_verification_code" : "post",
    "users/login" : "post",
    "users/password/reset" : "post",
    "users/sms_verification_code" : "post",
    "users/info" : "put",
    "users/password" : "put",

    "devices/get" : "get",
    "devices/users" : "get",
    "devices/modify" : "put",
    "devices/users" : "delete",//设备解绑某个用户 有问题
    "devices/users" : "delete",//设备解绑某个用户 有问题
    
    "authorization/devices" : "get",
    "authorization/devices/manage" : "post",
}

//if the method is get change data to url
var _eachData = function(data){
    var geturl = "";
    for(var key in data){
        geturl += key +"="+ data[key] +"&";
    }
    // console.log(geturl);
    return geturl;
};

//the function of ajax
var _ajax = function(method, url, data) {
    var timestamp = Date.parse(new Date());
    // console.log(timestamp);
    console.log(md5(_appSecret+timestamp)+","+timestamp);
    var p = new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        if("get" == method){
            url = url+"?"+_eachData(data);
        }else if("delete" == method){
            url = url+"?"+_eachData(data);
        }
        console.log(url);
        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-Type", "application/json"); 
        xhr.setRequestHeader("X-Application-Id", _appId); 
        xhr.setRequestHeader("Authorization", "token " + _userToken); 
        xhr.setRequestHeader("X-Request-Sign", md5(_appSecret+timestamp)+","+timestamp); 
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
var _changeName = function(name){
    var namelist = name.split("");
    var xxzm = namelist[(name.indexOf("/"))+1];
    var dxzm = xxzm.toUpperCase();

    var finalName = name.replace("/"+xxzm, dxzm);


    if(finalName.indexOf("/") > 0){
        // console.log(finalName.indexOf("/")+ " "+finalName);
        return _changeName(finalName);
    }else{
        // console.log(finalName.indexOf("/")+ " "+finalName);
        return finalName;
    }
};

//init user information
FG.init = function(appId, userToken, appSecret) {
	_userToken = userToken;
    _appId = appId;
	_appSecret = appSecret;
}

//make anonymous functions
for(var k in urls) {
    var fk = _changeName(k);
    // console.log("for = "+fk);
    FG[fk] = (function (url, method) {
      return function (param) {
        return _ajax(method, end_point+url, param);
        }
    })(k, urls[k]);
}

global.FG = FG;