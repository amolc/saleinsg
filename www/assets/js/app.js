'use strict';
var app = angular.module('80consult', ['angular-storage','angularPayments']);
if (document.location.hostname == "saleinsg.com")
{
  var baseurl = "https://saleinsg.com/api/";

}
else if (document.location.hostname == "www.saleinsg.com")
{
  var baseurl = "https://www.saleinsg.com/api/";

}
else if (document.location.hostname == "tradeexchange.co")
{
  var baseurl = "https://tradeexchange.co/api/";

}
else if (document.location.hostname == "www.tradeexchange.co")
{
  var baseurl = "https://www.tradeexchange.co/api/";

}else{

  var baseurl = "http://localhost:9888/api/";
}

app.config(['storeProvider', function (storeProvider) {
  storeProvider.setStore('sessionStorage');
}]);
