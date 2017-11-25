app.controller('contactcontroller', function ($scope, $location, $http, $window) {

  //----------- Book Now ------------------------///

  $scope.adults = ['0','1','2','3','4','5','6','7','8','9','10'];
  $scope.child = ['0','1','2','3','4','5','6','7','8','9','10'];
 // $scope.urlParams = $location.search();
 // console.log($location.search());
   $scope.register = function(formRegistration){

            console.log($scope.registration);
        
            $scope.alertmessage = '';
            $scope.formvalidate ="true" ;
                    

                if($scope.formvalidate=="true"){
                    $http.post(baseurl + 'register', $scope.registration).success(function(data, status) {

                        console.log('data',data)

                        if (data.status == false) 
                        {
                                $scope.alertmessage=data.message;
                                $("#alertmessage").show('slow');
                        }
                        else
                        {
                            $("#formRegistration").hide();
                            $("#thankyoudiv").show('slow');
                        }
                                
                        //console.log('data',data)
                    });  
                }

            }



  $scope.booknow = function (req, res) {

    console.info("in consult");


    //$scope.urlParams = $location.search();
    //alert($scope.urlParams.pck);
    $scope.data = {};
    $scope.data.fullname = $scope.fullname;
    $scope.data.email = $scope.email;
    $scope.data.travelDate = $scope.travelDate;
    $scope.data.phonenumber = $scope.phonenumber;
    $scope.data.message = $scope.message;
    $scope.data.packageName = $scope.packagename;
    $scope.data.adults = $scope.adults;
    $scope.data.Child = $scope.Child;
    $scope.data.promoCode = $scope.promoCode;


    $http.post(baseurl + 'consult/', $scope.data).success(function (res) {
      if (res.status == 'false') {
      }
    }).error(function () {
      console.log("error");
    })
    document.contactform.reset();
    $("#thankyou").show();
    $("#thankyou").delay(3200).hide(300);

    location.href='/index.html';
  }

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
});