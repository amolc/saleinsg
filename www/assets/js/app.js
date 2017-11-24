'use strict';
var app = angular.module('80consult', ['angular-storage']);
if (document.location.hostname == "saleinsg.com")
{
  var baseurl = "https://saleinsg/api/";

}
else if (document.location.hostname == "www.saleinsg.com")
{
  var baseurl = "https://www.saleinsg/api/";

}else{

  var baseurl = "http://localhost:6010/api/";
}

app.config(['storeProvider', function (storeProvider) {
  storeProvider.setStore('sessionStorage');
}]);
