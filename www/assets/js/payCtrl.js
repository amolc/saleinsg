app.controller('paymentcontroller', function ($scope, $location, $http, $window) {

	$window.Stripe.setPublishableKey('pk_test_lTp89fhcIMVEFL2HSVRqJTHO');

    

           $scope.getdeposites = function (req, res) {


      User_Id = window.localStorage.getItem('User_Id');
  
      $http.get(baseurl + 'buyerdeposites/'+User_Id).success(function(data, status) {
                   $scope.depositlist = data;                                     
              });

     }


         $scope.stripeCallback = function (code, result) {

          // console.log($scope.cardname);
          // console.log($scope.number);
          // console.log($scope.expiry);
          // console.log($scope.cvc);
          // console.log(result);

          if (result.error) {
               // window.alert('it failed! error: ' + result.error.message);
                $scope.paymessage = result.error.message ;
                $scope.transactionid = result.id ;

          } else {

          		$scope.data.stripeToken = result.id ;
              var date = new Date();
              var paydate = date.toLocaleDateString('en-GB', {timeZone: 'Asia/Singapore' });
              var paytime = date.toLocaleTimeString('en-US', {hour: '2-digit',minute: '2-digit',timeZone: 'Asia/Singapore' });
              dateToday = paydate+' '+paytime;
              $scope.data.datetime = dateToday ;
              $scope.data.date = paydate ;
              $scope.data.type = 'Deposit' ;
              $.getJSON('//api.ipify.org?format=jsonp&callback=?', function(data) {
                // response = JSON.stringify(data, null, 2);
                var response = data;
                $scope.data.ip = response.ip;
                //console.log($scope.data);
                $http.post(baseurl + 'deposit/',$scope.data).success(function (res) {

                    if (res.status == 'false') {

                    }
                    else {
                         
                      
                      User_Id = window.localStorage.getItem('User_Id');
  
                      $http.get(baseurl + 'buyerdeposites/'+User_Id).success(function(data1, status) {
                                   $scope.depositlist = data1;  
                                   console.log($scope.depositlist);
                                   $("#payform").hide();  
                                   $("#deplist").show();                                   
                              });
                       
                    }

                }).error(function () {

                }); 
        
              });
                       	
              

          }

      };

});

