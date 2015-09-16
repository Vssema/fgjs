var h=require('fgjs');

var appid = "0edfd64c-0f9a-4472-a8bc-b06b75c3909a";
var appSecret = "63b9c58fe0bd9fa397c205bdd4eb6db1";
FG.init(appid, appSecret);

var par = {"username":"13524467545","password":"123456"};//v2
FG.login(par).then(function(ret){
    console.log("ret");
    console.log(ret);
},function(err){
    console.log("err");
    console.log(err);
});
FG.hello('ROCKE');