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

     $scope.table = function(){

       
                        $('.dataTables-example').DataTable({
                pageLength: 25,
                responsive: true,
                dom: '<"html5buttons"B>lTfgitp',
                buttons: [
                    { extend: 'copy'},
                    {extend: 'csv'},
                    {extend: 'excel', title: 'ExampleFile'},
                    {extend: 'pdf', title: 'ExampleFile'},

                    {extend: 'print',
                     customize: function (win){
                            $(win.document.body).addClass('white-bg');
                            $(win.document.body).css('font-size', '10px');

                            $(win.document.body).find('table')
                                    .addClass('compact')
                                    .css('font-size', 'inherit');
                    }
                    }
                ]

            });
            $('[data-toggle="tooltip"]').tooltip();

    }

    $scope.getAllUsers = function (req, res) {


            $http.get(baseurl + 'getAllUsers').success(function(data, status) {    
                   //console.log(status); 

                   if (status == 200) 
                   {

                     $scope.userlist = data; 

                      $.each($scope.userlist,function (index, value) { 

                        SrNo = parseInt(index)+1;

                        if (value.CreateDate== '' || value.CreateDate==null) {
                           date = '';
                         
                        }
                        else
                        {
                           date = value.CreateDate.substring(0,10);
                        }

                        var content = '<tr><td>'+SrNo+'</td><td>'+value.FirstName+' '+value.LastName+'</td><td>'+value.Email+'</td><td>'+value.Password+'</td><td>'+value.Phone+'</td><td>'+value.CountryTitle+'</td><td>'+date+'</td><td><a href="userdetail.html?id='+value.SupId+'"><i class="fa fa-eye"></i></td></tr>';

                        $("#usertable").append(content);
                      
                  }); 

                      $scope.table();

                   }
                  

            });

     }

     $scope.getUserDetails = function (req, res) {

             //console.log($scope.enquiry);

      $scope.user = {};

      var url = window.location.href;

      var parts = url.split("?");
              //console.log(parts.length);
      if(parts.length>1){
      var urlparams = parts[1];

      var urlpart = urlparams.split('&');
      var UserId = urlpart[0].split('=');



      if (UserId[0]=='id') 
      {


       $scope.user.UserId= UserId[1];

       $http.get(baseurl + 'getUserDetails/'+$scope.user.UserId).success(function(data, status) {

           $scope.user = data; 
           console.log($scope.user);         
       
      });

      }

    }
    else
    {
        location.href = "dashboard.html";
    }

     }
    

     $scope.productrequests = function(){

        $http.get(baseurl + 'productrequests').success(function (res) {

            if (res.status == 'false') {

            }
            else {
               // console.log(res);
                $scope.reqlist = res;

                 $.each($scope.reqlist,function (index, value) { 

                        SrNo = parseInt(index)+1;

                        var content = '<tr><td>'+SrNo+'</td><td>'+value.FirstName+' '+value.LastName+'</td><td>'+value.CountryTitle+'</td><td>'+value.ProductName+'</td><td>'+value.Currency+' '+value.ExpectedPrice+'</td><td>'+value.Quantity+'</td><td>'+value.count+'</td></tr>';

                        $("#requesttable").append(content);
                      
                  }); 

                      $scope.table();

            }

        }).error(function () {

        });

    }




});

