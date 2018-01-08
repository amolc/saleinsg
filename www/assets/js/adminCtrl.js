app.controller('admincontroller', function ($scope, $location, $http, $window) {


            $scope.adminlogin = function(){

            $("#alertmessage").hide(); 

            $http.post(baseurl + 'adminlogin', $scope.logininfo).success(function(data, status) {

              console.log(data);

                if(data.usernameexist === false)
                {

                    $scope.alertmessage=data.message;
                    $("#alertmessage").show('slow');  

                }
                else
                {

                    if(data.passValid === true)
                    {

                        $scope.noemailpass = false;
                        $scope.noemail = false;
                        $scope.nopass = false;
                        $scope.loginFailure = false;
                        $scope.loginSuccess = true;

                        $scope.loginSuccessMsg = 'Successfully Login.';


                        window.localStorage.setItem('Admin_Id', data.value.Id);
                        window.localStorage.setItem('Admin_UserName', data.value.UserName);
                        window.localStorage.setItem('Admin_Name', data.value.FirstName+' '+data.value.LastName);

                       if (window.localStorage.getItem("GoToPage") === null) {
                                 window.location = "dashboard.html";
                        }
                        else
                        {
                           window.location = window.localStorage.getItem("GoToPage")
                        }
                       
                    }
                    else
                    {
                        $scope.alertmessage=data.message;
                        $("#alertmessage").show('slow');    
                    }


                }
                

            });


    }

      $scope.adminlogout = function() {             

          //window.localStorage.clear();
          window.localStorage.removeItem('Admin_Id');
          window.localStorage.removeItem('Admin_UserName');
          window.localStorage.removeItem('Admin_Name');
          location.href = "index.html"
    }  

    $scope.getAllUsers = function (req, res) {


            $http.get(baseurl + 'getAllUsers').success(function(data, status) {    
                 // console.log(data); 
                   $scope.userlist = data;  

            });

     }
    

     $scope.productrequests = function(){

        $http.get(baseurl + 'productrequests').success(function (res) {

            if (res.status == 'false') {

            }
            else {
               // console.log(res);
                $scope.reqlist = res;
            }

        }).error(function () {

        });

    }




});

