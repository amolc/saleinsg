    'use strict';
    var app = angular.module('shopcart', ['angular-storage','angularPayments','720kb.datepicker']);
    app.config(['storeProvider', function(storeProvider) {
        storeProvider.setStore('sessionStorage');

    }]);

    app.filter('range', function() {
      return function(input, min, max) {
        min = parseInt(min); //Make string input int
        max = parseInt(max);
        for (var i=min; i<max; i++)
          input.push(i);
        return input;
      };
    });

    app.filter('minutesrange', function() {
      return function(input, min, max) {
        min = parseInt(min); //Make string input int
        max = parseInt(max);
        for (var i=min; i<max; i+=5)
          input.push(i);
         
        return input;
      };
    });

  /*$scope.hoursArray = {'01':'01','02':'02','03':'03','04':'04','05':'05','06':'06','07':'07','08':'08','09':'09','10':'10','11':'11','12':'12','13':'13','14':'14','15':'15','16':'16','17':'17','18':'18','19':'19','20':'20','21':'21','22':'22','23':'23','24':'24'};
  $scope.minutesArray = {};*/

    app.controller('orderCtrl', function($scope, $http,$window,$location ,$sce, $timeout, store) {
      $window.Stripe.setPublishableKey('pk_test_lTp89fhcIMVEFL2HSVRqJTHO'); //'pk_test_OKKZyHD6nnZujaeDy0ks4fWa'
      //$window.Stripe.setPublishableKey('pk_live_325verdKtnzQhpKw10fVcXSU'); 

      $scope.redirect = function () {
        console.log("redirect");
        location.href='index.html';
      }

      $scope.carImages = {'1_110':'mercedes-benz-s.jpg','1_130':'mercedes-benz-s.jpg','2_55':'mercedes-benz-e200.jpg','2_60':'mercedes-benz-e200.jpg','3_55':'toyota-alphard.jpg','3_60':'toyota-alphard.jpg','4_60':'toyota-hiace.jpg','4_65':'toyota-hiace.jpg','5_60':'coach-44.jpg','5_90':'coach-44.jpg','6_85-60':'nissan-urvan.jpg','7_85-60':'nissan-urvan.jpg'};
      $scope.carArray = {'1_110':'Mercedes Benz S-Class - [Hourly-$ 110.00]','1_130':'Mercedes Benz S-Class - [One Way-$ 130.00]','2_55':'Mercedes Benz E-Class - [Hourly-$ 55.00]','2_60':'Mercedes Benz E-Class - [One Way-$ 60.00]','3_55':'Toyota Alphard - [Hourly-$ 55.00]','3_60':'Toyota Alphard - [One Way-$ 60.00]','4_60':'Minibus (13 seater) - [Hourly-$ 60.00]','4_65':'Minibus (13 seater) - [One Way-$ 65.00]','5_60':'Coach (45 seater) - [Hourly-$ 60.00]','5_90':'Coach (45 seater) - [One Way-$ 90.00]','6_85-60':'Luggage Van - [Hourly-$ 85.60]','7_85-60':'Luggage Van - [One Way-$ 85.60] '};


      //Get all customers to display

    $scope.allCars = function (req, res) {

        /*if (window.localStorage.getItem('user') != "1") {
            $window.location = 'index.html';
        }*/
        
        $http.get(baseurl + 'getAllcars').success(function (res) {

            if (res.status == 'false') {

            }
            else {

                /*res.forEach(function (row) {
                    if (row.lastVisit)
                        row.lastVisit = new Date(row.lastVisit);
                });*/
                $scope.customerList = res;
                console.log('customerList: ', $scope.customerList);
            }

        }).error(function () {

        });
    }

    $scope.getSelectedCars = function (req, res) {

            var url = window.location.href;
            console.log(url);
            var parts = url.split("?");
            var urlparams = parts[1];
            //console.log(parts);
            // console.log(urlparams);
            var urlpart = urlparams.split('&');
            var carkey = urlpart[0].split('=');
            var tourtype = urlpart[1].split('=');
            //console.log(carkey[1]);
            var carimg  = carkey[1] ;
            //console.log(tourtype[1]);

            //$scope.carimg = $scope.carImages[carkey[1]];
            $scope.carkey = carkey[1];
            $scope.tourtype = tourtype[1];
            $scope.carid =carkey[1];


        $http.get(baseurl + 'getselectedcars/'+$scope.carid).success(function (res) {

            if (res.length <= 0) {
                $window.location = 'order.html?id='+$scope.carid+'&btype='+$scope.tourtype;
            }else {
                $scope.customerList = res;
                console.log('customerList: ', $scope.customerList);
            }

        }).error(function () {

        });
    }



      $scope.bankorder = function(){

          //  console.log("bank order called");
          // console.log('car name' ,$scope.carArray[$scope.data.qty]);
          //  console.log('Address2', $scope.data.orderaddress2);
          //  console.log('price' ,$scope.data.productprice);
          //  console.log('totalprice' ,$scope.data.totalprice);
          //  console.log('Name',$scope.data.ordername);
          //  console.log('Email', $scope.data.orderemail);
          //  console.log('Phone', $scope.data.orderphone);
          //  console.log('Address1', $scope.data.orderaddress1);
          //  console.log('Address2', $scope.data.orderaddress2);
          //  console.log('Address2', $scope.data.paymenttype);
          //  console.log('Message', $scope.data.ordermessage);
          //  console.log('Order Terms', $scope.data.orderterms);
          //$scope.data.bookedcar = $scope.carArray[$scope.data.qty];
          $scope.data.bookedcar = $scope.bookedcar; 
           console.log($scope.data);
            $http.post(baseurl + 'addbankorder/',$scope.data).success(function(res) {
                  $scope.response = res;
                //  console.log(res);
                  if (res.status == 'false') {
                    alert(res.message);
                  } else {
                    alert(res.message);
                    $("#orderform").hide();
                    $("#preview").hide();
                    $("#thankyou").show();
                    //$location.path("/Cart");
                  }
                }).error(function() {
                      // alert("Please check your internet connection or data source..");
                });
            /*$http.post(baseurl + 'addbankorder/',$scope.data)
                .success(function(res) {
                  //console.log(res);
                  $scope.redirect();
                })
                .error(function() {
                  alert("Please check your internet connection or data source..");
                });*/
      }

      $scope.stripeCallback = function (code, result) {

          if (result.error) {
              //window.alert('it failed! error: ' + result.error.message);
                $scope.paymessage = result.error.message ;
                $scope.transactionid = result.id ;

                console.log("Error");
                console.log('car',$scope.bookedcar);
                console.log('Name',$scope.ordername);
                console.log('Email', $scope.orderemail);
                console.log('Phone', $scope.orderphone);
                console.log('Address1', $scope.orderaddress1);
                console.log('Address2', $scope.orderaddress2);
                console.log('PostalCode', $scope.orderpostalcode);
                console.log('ProductName' ,$scope.productname);
                console.log('price' ,$scope.productprice);
                console.log('qty' , $scope.qty);
                console.log('deliverycharge' ,$scope.deliverycharge);
                console.log('price' ,$scope.productprice);
                console.log('totalprice' ,$scope.totalprice);
                $("#orderform").hide();
                $("#payform").show();
                $("#thankyou").hide();

          } else {
                //$scope.data = {};
              //window.alert('success! token: ' + result.id);
                $scope.message = "Card Successfully Approved."
                $scope.data.stripeToken = result.id ;
                $scope.data.bookedcar = $scope.bookedcar; //$scope.carArray[$scope.data.car];
                $scope.paymessage = $scope.message ;
                $("#orderform").hide("slow");
                $("#payform").hide("slow");
                $("#thankyou").show("slow");
                console.log('car' , $scope.carkey);
                console.log('qty' , $scope.carArray[$scope.data.car]);
                console.log('deliverycharge' ,$scope.data.deliverycharge);
                console.log('price' ,$scope.data.productprice);
                console.log('totalprice' ,$scope.data.totalprice);
                console.log('Name',$scope.data.ordername);
                console.log('Email', $scope.data.orderemail);
                console.log('Phone', $scope.data.orderphone);
                console.log('Address1', $scope.data.orderaddress1);
                console.log('Address2', $scope.data.orderaddress2);
                console.log('PostalCode', $scope.data.orderpostalcode);

              /*  $http.post(baseurl + 'addorder/', $scope.data).success(function (res) {
                  if (res.status == 'false') {
                  }
                }).error(function () {
                  console.log("error");
                })*/

                //console.log($scope.data);
                $http.post(baseurl + 'addorder/',$scope.data).success(function(res) {
          				$scope.response = res;
          			//	console.log(res);
          				if (res.status == 'false') {
          					alert(res.message);
          				} else {
          					alert(res.message);
          					//$location.path("/Cart");
          				}
          			}).error(function() {
          				    // alert("Please check your internet connection or data source..");
          			});
          }

      };

        $scope.order = function(){
             $("#alertmessage").hide();
             $scope.formvalidate ="true" ;
             console.log("order called");
             console.log($scope.data);
             $scope.data.bookedcar = $scope.bookedcar;
             $scope.data.car = $scope.carkey;
             $scope.data.bookedtype = $scope.tourtype;

             //alert($scope.bookedcar+"--"+$scope.tourtype);
             console.log('bookedcar' , $scope.bookedcar);
             console.log('troutype' , $scope.tourtype);
             console.log('picklocation' , $scope.data.picklocation);
             console.log('destination' , $scope.data.destination);
             console.log('noof hours' , $scope.data.nohours);

             console.log('car' , $scope.data.car);
             console.log('Address2', $scope.data.orderaddress2);
             console.log('price' ,$scope.data.productprice);
             console.log('totalprice' ,$scope.data.totalprice);
             console.log('Name',$scope.data.ordername);
             console.log('Email', $scope.data.orderemail);
             console.log('Phone', $scope.data.orderphone);
             console.log('Address1', $scope.data.orderaddress1);
             console.log('Address2', $scope.data.orderaddress2);
             console.log('Address2', $scope.data.paymenttype);
             console.log('Message', $scope.data.ordermessage);
             console.log('Order Terms', $scope.data.orderterms);
             console.log('Pickup Date', $scope.data.pickupdate);
             console.log('Pickup Hours', $scope.data.pickuphours);
             console.log('Pickup minutes', $scope.data.pickupminutes);
             //console.log($scope.data);

             if(typeof $scope.data.picklocation === 'undefined'){
               console.log("Pickup location should not be empty");
               $scope.formvalidate ="false" ;
               $scope.alertmessage="Pickup location should not be empty";
                   $("#alertmessage").show('slow');
             }else if(typeof $scope.data.destination === 'undefined'){
               console.log("Destination should not be empty");
               $scope.formvalidate ="false" ;
               $scope.alertmessage="Destination should not be empty";
                   $("#alertmessage").show('slow');
             }else if($scope.tourtype == 'hourly'){
                if(typeof $scope.data.nohours === 'undefined'){
                 console.log("No of hours is not Selected");
                 $scope.formvalidate ="false" ;
                 $scope.alertmessage="No of hours should not be empty";
                   $("#alertmessage").show('slow');
               }    
             }else if(typeof $scope.data.pickupdate === 'undefined'){
               console.log("pickupdate is not Selected");
               $scope.formvalidate ="false" ;
               $scope.alertmessage="Pickup date should not be empty";
                   $("#alertmessage").show('slow');
             }
             else if(typeof $scope.data.pickuphours === 'undefined'){
               console.log("pickupdate is not Selected");
               $scope.formvalidate ="false" ;
               $scope.alertmessage="Pickup Time should not be empty";
                   $("#alertmessage").show('slow');
             }
             else if(typeof $scope.data.pickupminutes === 'undefined'){
               console.log("pickupdate is not Selected");
               $scope.formvalidate ="false" ;
               $scope.alertmessage="Pickup Time should not be empty";
                   $("#alertmessage").show('slow');
             }else if(typeof $scope.data.ordername === 'undefined'){
               console.log("ordername is null");
              $scope.formvalidate ="false" ;
               $scope.alertmessage="Name should not be empty";
               $("#alertmessage").show('slow');
             }
             else if(typeof $scope.data.orderemail === 'undefined'){
               console.log("Order Email is null");
               $scope.formvalidate ="false" ;
               $scope.alertmessage="Email should not be empty";
               $("#alertmessage").show('slow');
             }
             else if(typeof $scope.data.orderphone === 'undefined'){
               console.log("Order Phone is null");
               $scope.formvalidate ="false" ;
               $scope.alertmessage="Phone Number should not be empty";
                  $("#alertmessage").show('slow');
             }
             else if(typeof $scope.data.orderaddress1 === 'undefined'){
               console.log("Address Field is null");
               $scope.formvalidate ="false" ;
               $scope.alertmessage="Address should not be empty";
                  $("#alertmessage").show('slow');
             }
             else if(typeof $scope.data.orderaddress2 === 'undefined'){
               console.log("Address2 is null");
               $scope.formvalidate ="false" ;
               $scope.alertmessage="Address-2 should not be empty";
                  $("#alertmessage").show('slow');
             }
             else if(typeof $scope.data.orderpostalcode === 'undefined'){
               console.log("Postalcode is null");
               $scope.formvalidate ="false" ;
               $scope.alertmessage="Postalcode should not be empty";
                   $("#alertmessage").show('slow');
             }
             else if($scope.data.orderterms === 'false'){
               console.log("Terms is not checked");
               $scope.formvalidate ="false" ;
               $scope.alertmessage="Terms should be Selected";
                   $("#alertmessage").show('slow');
             }
              
             if($scope.formvalidate=="true"){
              alert($scope.data.paymenttype);
                 if($scope.data.paymenttype=="Bank Transfer"){

                  console.log($scope.data.paymenttype);
                   
                   $("#preview").show();
                   $("#orderform").hide();
                   $("#payform").hide();
                   $("#thankyou").hide();
                }else {
                  $("#orderform").hide();
                  $("#payform").show("slow");
                  $("#thankyou").hide();
                   $("#preview").hide();
                }

             }
        }

        $scope.calculate = function (){
            /*console.log('qty', $scope.carkey);
            var arr = [];
            var carVal = $scope.carkey.replace("-",".");
            arr = carVal.split('_');
            console.log($scope.carArray);
            $scope.data.deliverycharge = 0 ;
            $scope.data.schedulecharge = 0 ;
            $scope.data.totalprice = arr['1'] ;
            $scope.data.productprice = arr['1'] ;*/

            $scope.data.deliverycharge = 0 ;
            $scope.data.schedulecharge = 0 ;
            if($scope.tourtype=='hourly'){
              $scope.data.totalprice = $scope.hourlyprice;
            }else{
              $scope.data.totalprice = $scope.oneWayprice;
            }
            $scope.data.productprice = $scope.hourlyprice ;
            /*if($scope.data.qty==1 || $scope.data.qty==2){
              $scope.data.deliverycharge = 5 ;
            }

            if($scope.data.schedule!=="0"){
              $scope.data.schedulecharge = 2 ;
            }*/
            $scope.data.itemprice = $scope.data.qty*$scope.data.productprice;
            $scope.data.totalprice = $scope.data.itemprice+$scope.data.deliverycharge+$scope.data.schedulecharge ;
            console.log('totalprice',$scope.data.totalprice);

            if($scope.tourtype=='hourly'){
              $scope.data.productprice = $scope.hourlyprice;
              $scope.data.itemprice = $scope.hourlyprice;
              $scope.data.totalprice = $scope.hourlyprice*$scope.data.nohours;
            }else{
              $scope.data.itemprice = $scope.oneWayprice;
              $scope.data.productprice = $scope.oneWayprice;
              $scope.data.totalprice = $scope.oneWayprice;
            }
           // alert($scope.data.itemprice+"--"+$scope.data.totalprice);
            /*if($scope.data.schedule!=="0"){
              $scope.data.schedulecharge = 2 ;
            }*/
            
            
            console.log('totalprice',$scope.data.totalprice);
          }
/*
$scope.initfunc = function () {
    $("#thankyou").hide();
    var url = window.location.href;
    console.log(url);
    var parts = url.split("?");
    var params = parts[1];
    console.log(params);
    var package = params.split("=");
    console.log(package[1]);
    var packagename  = package[1] ;
    $scope.packagename = packagename.replace(new RegExp('%20', 'g'),' ');
    //$("#packageName").val($scope.packagename);
    //alert($scope.packagename);
  }
});*/
          $scope.init = function() {
              $scope.data = {};
              var url = window.location.href;
               // console.log(url);
                var parts = url.split("?");
              if(parts.length>0){
                   var urlparams = parts[1];
                   //console.log(parts);
                   // console.log(urlparams);
                   var urlpart = urlparams.split('&');
                   var carkey = urlpart[0].split('=');
                   var tourtype = urlpart[1].split('=');
                    console.log(carkey[1]);
                   var carimg  = carkey[1] ;
                   //console.log(tourtype[1]);
    
                    //$scope.carimg = $scope.carImages[carkey[1]];
                    $scope.carkey = carkey[1];
                    $scope.tourtype = tourtype[1];
    
                    $http.get(baseurl + 'getcardetails/'+$scope.carkey).success(function (res) {
                        if (res.status == 'false') {
                        }else {
                            $scope.cardetails = res[0];
                            $scope.bookedcar = res[0]['CarModel'];
                            $scope.itemprice = res[0]['HourlyRate'];
                            $scope.hourlyprice = res[0]['HourlyRate'];
                            $scope.oneWayprice = res[0]['OneWayRate'];
                            if($scope.tourtype=='hourly'){
                              $scope.data.totalprice = $scope.hourlyprice;
                              $scope.itemprice = $scope.hourlyprice;
                            }else{
                              $scope.itemprice = $scope.oneWayprice
                              $scope.data.totalprice = $scope.oneWayprice;
                            }
                            //console.log('car Details: ', $scope.cardetails);
                        }
                    }).error(function () {
                    });
              }
              $("#mydropdownlist").val("thevalue");
              
              //console.log($scope.carimg);
              $scope.data.paymenttype = "Credit Card";
              $scope.data.qty ="2" ;
              $scope.data.deliverycharge = 0 ;
              $scope.data.productprice = 0 ;
              $scope.data.totalprice = $scope.data.productprice*$scope.data.nohours ;
              $scope.data.productname = "Kumarlimo Car Rental";
              $scope.data.rentaltype = "Rental Type";
              $scope.data.productsku = "0001";
              $scope.data.schedule = "0"
              $scope.data.schedulecharge = "0" ;
              $scope.data.orderterms ="false" ;
              $scope.data.itemprice = $scope.data.productprice*2 ;
              w3IncludeHTML();
              $scope.calculate();
                
              $("#payform").hide();
              $("#thankyou").hide();
              $("#preview").hide();
              $("#alertmessage").hide();
          }
          //var baseurl = "http://localhost:8881/api/" ;
          //var baseurl = "http://128.199.230.90:5000/api/" ;

          if (document.location.hostname == "kumarlimo.80startups.com")
          {
            var baseurl = "https://kumarlimo.80startups.com/api/";
            app.config(['storeProvider', function (storeProvider) {
              storeProvider.setStore('sessionStorage');
            }]);

          }else{

            var baseurl = "http://localhost:8881/api/";
            //var baseurl = "http://crm.fountaintechies.com/api/";
            app.config(['storeProvider', function (storeProvider) {
              storeProvider.setStore('sessionStorage');
            }]);
          }

    });
