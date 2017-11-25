'use strict';
var app = angular.module('80consult', ['angular-storage']);
if (document.location.hostname == "saleinsg.com")
{
  var baseurl = "https://saleinsg.com/api/";

}
else if (document.location.hostname == "www.saleinsg.com")
{
  var baseurl = "https://www.saleinsg.com/api/";

}else{

  var baseurl = "http://localhost:9888/api/";
}

app.config(['storeProvider', function (storeProvider) {
  storeProvider.setStore('sessionStorage');
}]);
