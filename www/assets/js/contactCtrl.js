 app.filter('range', function() {
      return function(input, min, max) {
        min = parseInt(min); //Make string input int
        max = parseInt(max);
        for (var i=min; i<max; i++)
          input.push(i);
        return input;
      };
    });


app.controller('contactcontroller', function ($scope, $location, $http, $window) {

     $window.Stripe.setPublishableKey('pk_test_lTp89fhcIMVEFL2HSVRqJTHO');

  //----------- Book Now ------------------------///

  $scope.adults = ['0','1','2','3','4','5','6','7','8','9','10'];
  $scope.child = ['0','1','2','3','4','5','6','7','8','9','10'];
 // $scope.urlParams = $location.search();
 // console.log($location.search());

   $scope.getCountries = function() {

    $scope.registration = {};

    $http.get(baseurl + 'allcountries').success(function (res) {

            if (res.status == 'false') {

            }
            else {
               // console.log(res);
                $scope.countrylist = res;
               // $scope.registration.CountryId = $scope.countrylist[0].CountryId;
               //console.log($scope.countrylist);
            }

        }).error(function () {

        });

   }

   $scope.register = function(formRegistration){

           // console.log($scope.registration.CountryId);
        
            $scope.alertmessage = '';

             if(typeof $scope.registration.CountryId === 'undefined'){
              $scope.alertmessage="Please Select Country";
              $("#alertmessage").show('slow');
             }
             else
             {
               // console.log("register IN");
                    $http.post(baseurl + 'register', $scope.registration).success(function(data, status) {

                        console.log('data',data)

                        if (data.status == false) 
                        {
                                $scope.alertmessage=data.message;
                                $("#alertmessage").show('slow');
                        }
                        else
                        {
                            document.formRegistration.reset(); 
                            $("#formRegistration").hide();
                            $("#thankyoudiv").show('slow');
                        }
                                
                        //console.log('data',data)
                    });  

             }

            }



    $scope.verify = function() {
                //console.log('hi');
              $scope.data = {};
              var url = window.location.href;
               // console.log(url);
                var parts = url.split("?");
              if(parts.length>0){
                   var urlparams = parts[1];
                   //console.log(parts);
                   // console.log(urlparams);
                   var urlpart = urlparams.split('&');
                   var verificationstring = urlpart[0].split('=');
                   //var tourtype = urlpart[1].split('=');
                   //console.log(verificationstring[1]);
                   //var carimg  = carkey[1] ;
                   //console.log(tourtype[1]);
    
                    //$scope.carimg = $scope.carImages[carkey[1]];
                    $scope.verificationstring= verificationstring[1];
                   // $scope.tourtype = tourtype[1];
                    $http.get(baseurl + 'verify-account/'+$scope.verificationstring).success(function (res) {
                        if (res.status == 'false') {
                        }else {
                            //console.log('Account verified Successfully');
                            window.location = "login.html";
                        }
                    }).error(function () {
                    });
              }

          }


          $scope.login = function(logininfo,formLogin){

           // console.log($scope.logininfo);

            $("#alertmessage").hide(); 

            $http.post(baseurl + 'login', $scope.logininfo).success(function(data, status) {

              console.log(data);

                //console.log('data', data.status);

                //console.log('result: ',data.value);
               // console.log(data.value.address);
                if(data.emailexist === false)
                {

                    $scope.alertmessage=data.message;
                    $("#alertmessage").show('slow');  

                }
                else if(data.verifyValid === false)
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

                       // console.log(data);

                        window.sessionStorage.setItem('User_Id', data.value.SupId);
                        window.sessionStorage.setItem('User_Email', data.value.Email);
                        window.sessionStorage.setItem('User_Name', data.value.FirstName+' '+data.value.LastName);
                        window.sessionStorage.setItem('User_Phone', data.value.Phone);
                        window.sessionStorage.setItem('User_Location', data.value.CountryId);
                        //console.log(window.sessionStorage.getItem('UserId'));
                        //console.log(window.sessionStorage.getItem('UserId'));
                        


                       // window.location = "../index.html";
                        window.location = "index.html";
                    }
                    else
                    {
                        $scope.alertmessage=data.message;
                        $("#alertmessage").show('slow');    
                    }


                }
                

            });


    }


     $scope.isLoggedin = function() {

                $scope.User_Id = 0;
               // console.log($scope.User_Id);

                //console.log(window.sessionStorage.getItem('User_Id'));
                if (window.sessionStorage.getItem('User_Id')>0) 
                {
                    $scope.User_Id =window.sessionStorage.getItem('User_Id');
                }
               // console.log($scope.User_Id);

            } 

    $scope.logout = function() {             

          window.sessionStorage.clear();
          location.href = "index.html"
    }  

    $scope.getCategories = function() {

    $scope.product = {};
    $scope.product.SubCatId = 0;
    $scope.subcatlist = {};

    $http.get(baseurl + 'allcategories').success(function (res) {

            if (res.status == 'false') {

            }
            else {
               // console.log(res);
                $scope.categorieslist = res;
               // $scope.registration.CountryId = $scope.countrylist[0].CountryId;
               //console.log($scope.categorieslist);
            }

        }).error(function () {

        });

   }

    $scope.getSubCat = function() {

    $http.get(baseurl + 'getsubcategories/'+$scope.product.CategoryId).success(function (res) {

            if (res.status == 'false') {

            }
            else {
               // console.log(res);
                $scope.subcatlist = res;
               // $scope.registration.CountryId = $scope.countrylist[0].CountryId;
               //console.log($scope.categorieslist);
            }

        }).error(function () {

        });

   }

    var attachmentfile1 = [];
    var filelength;

     $scope.fileinit = function(ele) {


        $scope.product = {};
        $scope.attachmentCount = {};
        $scope.attachment = {};
        $scope.imgSrc = "";

    };

    $scope.updateattachment = function(file_browse) {

        var fileDisplayArea = document.getElementById('fileDisplayArea');
        // console.log(fileDisplayArea)
        if (file_browse == 'file_browse1') {
            var newfile = document.getElementById("file_browse1").files;
        }            
        var imageType = /image.*/;

         function readAndPreview(file) {

          // Make sure `file.name` matches our extensions criteria
          if ( /\.(jpe?g|png|gif)$/i.test(file.name) ) {
            var reader = new FileReader();

            reader.addEventListener("load", function () {
              var image = new Image();
              image.height = 100;
              image.title = file.name;
              image.class = 'avatar img-circle img-thumbnail';
              image.src = this.result;
              //attachmentfile1.push(this.result); 
              attachmentfile1[0] = this.result;
              $scope.product.imagename = file.name;
              
              /*if(filelength==index){
                callback(attachmentfile1);
              }*/
              imagepreview.appendChild( image );
            }, false);

            reader.readAsDataURL(file);
          }

        }

        if (newfile) {
          filelength = newfile.length;
          /*var index=0;
          for (var i = 0; i < newfile.length; i++) {
              readAndPreview(newfile[i],function(){
                console.log("done");
              });
              if(i==(newfile.length-1))
                console.log(attachmentfile1);

          };*/

          [].forEach.call(newfile,readAndPreview);
          setTimeout(function() { 
            //console.log(attachmentfile1.length);
            $scope.attachment.images = attachmentfile1;
            //$scope.userdetails.profile_image = attachmentfile1[0];
            $scope.attachmentCount.imagecount = attachmentfile1.length;
            //$scope.parameters.attachment = "testes testett";//{images:attachmentfile1};
            //$scope.parameters.attachment = JSON.stringify(images); 
            //$scope.addProduct($scope.parameters);
            //console.log(attachmentfile1); 
          }, 3000);
          
        }
        
    }


    $scope.saveproduct = function(product) {             

             // console.log($scope.product);


             if(typeof $scope.product.CategoryId === 'undefined'){
              $scope.alertmessage="Please Select Country";
              $("#alertmessage").show('slow');
             }
             else{

              $scope.product.CountryId = window.sessionStorage.getItem('User_Location');
             $scope.product.UserId = window.sessionStorage.getItem('User_Id');
           // console.log($scope.attachment.images);
            if (Object.keys($scope.attachment).length>0) {
                $scope.product.image = $scope.attachment.images[0];
              }else{
                $scope.product.iamge = '';
              }

            $http.post(baseurl + 'addproduct/',$scope.product).success(function(res) {

                  $('#imagepreview').children().remove();
                  $('.form-group select').val('');
                  
                  document.addproduct.reset(); 
                  $("#addproduct").hide();
                  $("#thankyoudiv").show('slow');


                }).error(function() {
                      // alert("Please check your internet connection or data source..");
                });

             }

    }  


     $scope.allproducts = function (req, res) {


      var url = window.location.href;

      var parts = url.split("?");
              //console.log(parts.length);
      if(parts.length>1){
      var urlparams = parts[1];

      var urlpart = urlparams.split('&');
      var location = urlpart[0].split('=');

      $scope.location= location[1];

      $http.get(baseurl + 'getproductsbylocation/'+$scope.location).success(function(data, status) {

           $scope.productslist = data;
       
      });
    }
    else
    {
        
        $http.get(baseurl + 'allproducts').success(function (res) {

            if (res.status == 'false') {

            }
            else {
               // console.log(res);
                $scope.productslist = res;
            }

        }).error(function () {

        });
    }

    }


  $scope.enquiryinit = function (req, res) {
       
     //console.log($scope.enquiry);

      $scope.enquiry = {};

      var url = window.location.href;

      var parts = url.split("?");
              //console.log(parts.length);
      if(parts.length>1){
      var urlparams = parts[1];

      var urlpart = urlparams.split('&');
      var productId = urlpart[0].split('=');

      $scope.enquiry.productId= productId[1];

       $http.get(baseurl + 'getProductDetails/'+$scope.enquiry.productId).success(function(data, status) {

           // console.log(data);

            $scope.enquiry.productname = data.ProductName;
            $scope.enquiry.SupName = data.FirstName+' '+data.LastName;
            $scope.enquiry.SupId = data.SupplierId;
            $scope.enquiry.SupEmail = data.Email;
            $scope.enquiry.BuyerId = 0;
            if (window.sessionStorage.getItem('User_Id')>0) 
            {
                $scope.enquiry.BuyerId = window.sessionStorage.getItem('User_Id');
                $scope.enquiry.fullname = window.sessionStorage.getItem('User_Name');
                $scope.enquiry.email = window.sessionStorage.getItem('User_Email');
                $scope.enquiry.phonenumber = window.sessionStorage.getItem('User_Phone');
            }
       
      });
    }
    else
    {
        location.href = "products.html";
    }

    }

      $scope.productinit = function (req, res) {

      $scope.product = {};

      var url = window.location.href;

      var parts = url.split("?");
              //console.log(parts.length);
      if(parts.length>1){
      var urlparams = parts[1];

      var urlpart = urlparams.split('&');
      var productId = urlpart[0].split('=');

      $scope.product.productId= productId[1];

       $http.get(baseurl + 'getProductDetails/'+$scope.product.productId).success(function(data, status) {

            $scope.product = data;
            $scope.product.orderqty = 1;
            $scope.product.paymenttype = 'Credit Card';
            $scope.qty = [];
            for (var i = 1; i <=  $scope.product.Quantity; i++) {
               $scope.qty.push(i);
            }
          //  console.log($scope.qty);
          
            if (window.sessionStorage.getItem('User_Id')>0) 
            {
                $scope.product.BuyerId = window.sessionStorage.getItem('User_Id');
                $scope.product.fullname = window.sessionStorage.getItem('User_Name');
                $scope.product.email = window.sessionStorage.getItem('User_Email');
                $scope.product.phonenumber = window.sessionStorage.getItem('User_Phone');
            }

       
      });
    }
    else
    {
        location.href = "products.html";
    }

    }

  $scope.submitenquiry = function (enquiryform) {

      $http.post(baseurl + 'submitenquiry',$scope.enquiry).success(function(data, status) {

        if (data.status == true) 
        {
             document.enquiryform.reset(); 
             $("#enquiryform").hide();
             $("#thankyou").show('slow');

        }
       
      });
  
  }

   $scope.order = function (enquiryform) {

      if($scope.product.paymenttype=="Bank Transfer"){
                  //console.log($scope.data.paymenttype);

                  $scope.product.total = $scope.product.orderqty*$scope.product.Price;

                    $http.post(baseurl + 'addbankorder/',$scope.product).success(function(res) {

                       $("#orderform").hide();
                       $("#payform").hide();
                       $("#thankyou").show("slow");


                  }).error(function() {
                        // alert("Please check your internet connection or data source..");
                  });
                   
                }else {
                    $("#orderform").hide();
                    $("#payform").show("slow");
                    $("#thankyou").hide();
                  }

  
  }

  $scope.stripeCallback = function (code, result) {


       //   console.log(code);


          if (result.error) {
              //window.alert('it failed! error: ' + result.error.message);
                $scope.paymessage = result.error.message ;
                $scope.transactionid = result.id ;

                console.log("Error");
                $("#orderform").hide();
                $("#payform").show();
                $("#thankyou").hide();

          } else {
                //$scope.data = {};
              //window.alert('success! token: ' + result.id);
               $scope.product.total = $scope.product.orderqty*$scope.product.Price;

                $scope.message = "Card Successfully Approved."
                $scope.product.stripeToken = result.id ;
                $scope.paymessage = $scope.message ;
                $("#orderform").hide("slow");
                $("#payform").hide("slow");
                $("#thankyou").show("slow");


              /*  $http.post(baseurl + 'addorder/', $scope.data).success(function (res) {
                  if (res.status == 'false') {
                  }
                }).error(function () {
                  console.log("error");
                })*/

                //console.log($scope.data);
                $http.post(baseurl + 'addorder/',$scope.product).success(function(res) {
                  $scope.response = res;
                //  console.log(res);
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