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
                    //{ extend: 'copy'},
                    //{extend: 'csv'},
                    {extend: 'excel',},
                    //{extend: 'pdf', title: 'ExampleFile'},

                    // {extend: 'print',
                    //  customize: function (win){
                    //         $(win.document.body).addClass('white-bg');
                    //         $(win.document.body).css('font-size', '10px');

                    //         $(win.document.body).find('table')
                    //                 .addClass('compact')
                    //                 .css('font-size', 'inherit');
                    // }
                    // }
                ]

            });
            $('[data-toggle="tooltip"]').tooltip();
            $('.buttons-excel span').html('Export');

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

                        var content = '<tr><td>'+SrNo+'</td><td>'+value.FirstName+' '+value.LastName+'</td><td>'+value.Email+'</td><td>'+value.Password+'</td><td>'+value.Phone+'</td><td>'+value.CountryTitle+'</td><td>'+date+'</td><td>'+value.count+'</td><td><a href="userdetail.html?id='+value.SupId+'"><i class="fa fa-eye"></i></td></tr>';

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

      $scope.getUserAccount = function (req, res) {

             //console.log($scope.enquiry);

      var url = window.location.href;

      var parts = url.split("?");
              //console.log(parts.length);
      if(parts.length>1){
      var urlparams = parts[1];

      var urlpart = urlparams.split('&');
      var UserId = urlpart[0].split('=');



      if (UserId[0]=='id') 
      {


       $scope.UserId= UserId[1];

       $http.get(baseurl + 'gettransactions/'+$scope.UserId).success(function(data, status) {

            $scope.transactionlist = data;
           //console.log($scope.user);         
       
      });

      }

    }
    else
    {
        location.href = "dashboard.html";
    }

     }

          $scope.getUserProducts = function (req, res) {

             //console.log($scope.enquiry);

      var url = window.location.href;

      var parts = url.split("?");
              //console.log(parts.length);
      if(parts.length>1){
      var urlparams = parts[1];

      var urlpart = urlparams.split('&');
      var UserId = urlpart[0].split('=');



      if (UserId[0]=='id') 
      {


       $scope.UserId= UserId[1];

       $http.get(baseurl + 'userproducts/'+$scope.UserId).success(function(data, status) {

            $scope.productlist = data;
           //console.log($scope.user);         
       
      });

      }

    }
    else
    {
        location.href = "dashboard.html";
    }

     }

       $scope.sendmail = function (req, res) {

         var date = new Date();
         $scope.user.date = date.toLocaleDateString('en-GB', {timeZone: 'Asia/Singapore' });
         $scope.user.msg = $('#message').val().replace(/\n/g, '<br />');

       $http.post(baseurl + 'sendmail/',$scope.user).success(function(data, status) {

          if (data.status == true)
          {
             //document.mailform.reset(); 
             $('#subject').val('');
             $('#message').val('');
             alert('Mail Sent Successfully');
             $('#user-form').modal('hide');
          }


      });

     }


       $scope.deleteUser = function (id) {

        //alert(id);

               var r = confirm("Are You Sure You want to Delete It?");
        if (r == true) 
        { 
          $http.get(baseurl + 'deleteUser/'+id).success(function(res) {

               
                window.location.href = 'dashboard.html';
                

          }).error(function() {
                      // alert("Please check your internet connection or data source..");
         });
            
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

                        var content = '<tr><td><a href="userdetail.html?id='+value.BuyerId+'" class="color-black">'+SrNo+'</a></td><td><a href="userdetail.html?id='+value.BuyerId+'" class="color-black">'+value.FirstName+' '+value.LastName+'</a></td><td><a href="userdetail.html?id='+value.BuyerId+'" class="color-black">'+value.CountryTitle+'</a></td><td><a href="userdetail.html?id='+value.BuyerId+'" class="color-black">'+value.ProductName+'</a></td><td><a href="userdetail.html?id='+value.BuyerId+'" class="color-black">'+value.Currency+' '+value.ExpectedPrice+'</a></td><td><a href="userdetail.html?id='+value.BuyerId+'" class="color-black">'+value.Quantity+'</a></td><td><a href="userdetail.html?id='+value.BuyerId+'" class="color-black">'+value.count+'</a></td></tr>';

                        $("#requesttable").append(content);
                      
                  }); 

                      $scope.table();

            }

        }).error(function () {

        });

    }




});

