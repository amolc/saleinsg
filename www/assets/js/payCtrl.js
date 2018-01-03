app.controller('paymentcontroller', function ($scope, $location, $http, $window) {

	$window.Stripe.setPublishableKey('pk_test_lTp89fhcIMVEFL2HSVRqJTHO');

    

           $scope.getdeposites = function (req, res) {


      User_Id = window.localStorage.getItem('User_Id');
  
      $http.get(baseurl + 'buyerdeposites/'+User_Id).success(function(data, status) {
                   $scope.depositlist = data;                                     
              });

     }


         $scope.stripeCallback = function (code, result) {

    
          $("#deposit").hide();
          // console.log($scope.cardname);
          // console.log($scope.number);
          // console.log($scope.expiry);
          // console.log($scope.cvc);
          // console.log(result);

          if (result.error) {
               // window.alert('it failed! error: ' + result.error.message);
                $("#deposit").show();
                $scope.paymessage = result.error.message ;
                $scope.transactionid = result.id ;

          } else {

              //$("#deposit").attr('disabled',true);
              $("#deposit").hide();
               $scope.paymessage = "";
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

                    if (res.status == true) {

                      $("#payform").hide();  
                      var content = '<tr> <td style="text-align: left; padding-left: 20px;">'+$scope.data.date+'</td><td>'+res.transactionid+'</td><td>SGD $'+$scope.data.amount+'</td></tr>';
                      $("#transactiontable").prepend(content);
                      $("#deplist").show();

                    }
                    else
                    { 
                        $("#deposit").show();
                        $scope.paymessage = res.message;
                    }
                   

                }).error(function () {

                }); 
        
              });
                       	
              

          }

      };

});

