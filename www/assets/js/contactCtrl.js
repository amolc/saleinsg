 app.filter('range', function() {
      return function(input, min, max,step) {
        min = parseInt(min); //Make string input int
        max = parseInt(max);
        // for (var i=min; i<max; i++)
        //   input.push(i);
        var i=min;
        while(i<=max)
        {
          input.push(i);
          i=i+min;
        }
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
                        window.location = "dashboard.html";
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
               //alert($scope.User_Id);

            } 

    $scope.logout = function() {             

          //window.sessionStorage.clear();
          window.sessionStorage.removeItem('User_Id');
          window.sessionStorage.removeItem('User_Email');
          window.sessionStorage.removeItem('User_Name');
          window.sessionStorage.removeItem('User_Phone');
          window.sessionStorage.removeItem('User_Location');
          window.sessionStorage.removeItem('wishlist');
          window.sessionStorage.removeItem('Other_User_Id');
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
               // console.log($scope.subcatlist);
               // $scope.registration.CountryId = $scope.countrylist[0].CountryId;
               //console.log($scope.categorieslist);
            }

        }).error(function () {

        });

   }

     $scope.getSubCatlist = function(CategoryId) {

      $scope.catId = CategoryId;
    $http.get(baseurl + 'getsubcategories/'+$scope.catId).success(function (res) {

            if (res.status == 'false') {

            }
            else {
               // console.log(res);
                $scope.subcatlist = res;
                console.log($scope.subcatlist);
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
                  $scope.spec = {};
                  $scope.spec.ProductId = res.value;
                  $("#specification").show('slow');


                }).error(function() {
                      // alert("Please check your internet connection or data source..");
                });

             }

    }  


    $scope.savespecification = function(spec) {             


            $http.post(baseurl + 'addspecification/',$scope.spec).success(function(res) {

                 
                  document.addproduct2.reset(); 

             var rowCount = $('#specificationtable >tr').length+1;

             var rowappend = "<tr><td>"+rowCount+"</td><td>"+$scope.spec.Title+"</td><td>"+$scope.spec.Description+"</td></tr>";

             $("#specificationtable").append(rowappend);



                }).error(function() {
                      // alert("Please check your internet connection or data source..");
                });

             }


     $scope.allproducts = function (req, res) {

      var previous =  document.referrer;
      var fullpath = previous.split("?");
      var pageurl = fullpath[0].split("/");
      var filename = pageurl.pop();
      console.log(filename);
      if (filename !== 'products.html') 
      {
          window.localStorage.removeItem('filter_country');
          window.localStorage.removeItem('filter_category');
          window.localStorage.removeItem('filter_subcat');
      }

      $scope.filter = {};
      var url = window.location.href;

      var parts = url.split("?");
              //console.log(parts.length);
      if(parts.length>1){

      var urlparams = parts[1];

      var urlpart = urlparams.split('&');

      if (urlpart.length==1) 
      {

        //alert(urlpart);
      var id = urlpart[0].split('=');
      //alert(type[1]);
      if (id[0]=='category') 
      {
         $http.get(baseurl + 'filterbycategory/'+id[1]).success(function(data, status) {

             $scope.productslist = data;  
             window.localStorage.setItem('filter_category',id[1]); 
             $scope.CategoryId = id[1]; 
        });

      }
      else if (id[0]=='country') 
      {

        $http.get(baseurl + 'filterbycountry/'+id[1]).success(function(data, status) {

             $scope.productslist = data;
             window.localStorage.setItem('filter_country',id[1]);
             $scope.CountryId = id[1];
                     
        });

      }

       if (window.localStorage.getItem('filter_country')) 
           $scope.CountryId = window.localStorage.getItem('filter_country');
       if (window.localStorage.getItem('filter_category')) 
           $scope.CategoryId = window.localStorage.getItem('filter_category');

          

       console.log($scope.CountryId);

      }
       else if(urlpart.length==2){

        //alert('hi');
        var urlparams = parts[1];

        var urlpart = urlparams.split('&');
        //alert(urlpart);
        var id1 = urlpart[0].split('=');
        var id2 = urlpart[1].split('=');
        //alert(type[1]);
        //alert(id1[0]);
        if (id1[0]=='country' && id2[0]=='category') 
        {

           $scope.filter.CountryId = id1[1];
           $scope.filter.CategoryId = id2[1];
           $http.post(baseurl + 'filterbyCouCat',$scope.filter).success(function(data, status) {

               $scope.productslist = data;  
               window.localStorage.setItem('filter_country',id1[1]);
               window.localStorage.setItem('filter_category',id2[1]);  
               $scope.CountryId = id1[1];
               $scope.CategoryId = id2[1];
          });

           if (window.localStorage.getItem('filter_country')) 
           $scope.CountryId = window.localStorage.getItem('filter_country');
           if (window.localStorage.getItem('filter_category')) 
           $scope.CategoryId = window.localStorage.getItem('filter_category');

        } 

         if (id1[0]=='category' && id2[0]=='subcategory') 
        {

           $scope.filter.CategoryId = id1[1];
           $scope.filter.SubCatId = id2[1];
           $http.post(baseurl + 'filterbyCatSub',$scope.filter).success(function(data, status) {

               $scope.productslist = data;  
               window.localStorage.setItem('filter_category',id1[1]);
               window.localStorage.setItem('filter_subcat',id2[1]);  
               $scope.CategoryId = id1[1];
               $scope.SubCatId = id2[1];
          });

           if (window.localStorage.getItem('filter_category')) 
              $scope.CategoryId = window.localStorage.getItem('filter_category');
           if (window.localStorage.getItem('filter_subcat')) 
              $scope.SubCatId = window.localStorage.getItem('filter_subcat');

        }          

     }


     else if(urlpart.length==3){
       //alert('hii');
        var urlparams = parts[1];

        var urlpart = urlparams.split('&');
        //alert(urlpart);
        var id1 = urlpart[0].split('=');
        var id2 = urlpart[1].split('=');
        var id3 = urlpart[2].split('=');
        //alert(type[1]);
        //alert(id1[0]);
        if (id1[0]=='country' && id2[0]=='category' && id3[0]=='subcategory') 
        {

           $scope.filter.CountryId = id1[1];
           $scope.filter.CategoryId = id2[1];
           $scope.filter.SubCatId = id3[1];
           $http.post(baseurl + 'filterbyall',$scope.filter).success(function(data, status) {

               $scope.productslist = data;  
               window.localStorage.setItem('filter_country',id1[1]);
               window.localStorage.setItem('filter_category',id2[1]);
               window.localStorage.setItem('filter_subcat',id3[1]);    
               $scope.CountryId = id1[1];
               $scope.CategoryId = id2[1];
               $scope.SubCatId = id3[1];
          });

           if (window.localStorage.getItem('filter_country')) 
           $scope.CountryId = window.localStorage.getItem('filter_country');
           if (window.localStorage.getItem('filter_category')) 
           $scope.CategoryId = window.localStorage.getItem('filter_category');
           if (window.localStorage.getItem('filter_subcat')) 
           $scope.SubCatId = window.localStorage.getItem('filter_subcat');

        }           

     }
      

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

     $scope.userproducts = function(){

        $scope.userid =  window.sessionStorage.getItem('User_Id');

        //console.log($scope.userid);

        $http.get(baseurl + 'userproducts/'+$scope.userid).success(function(data, status) {

            console.log(data);

            $scope.productslist = data;

          //  document.addStartupForm.reset(); 
          //  $('.form-group select').val('');
          //  console.log(data);

        });

    }

     $scope.buyerorders = function(){


        $scope.BuyerId =  window.sessionStorage.getItem('User_Id');

        //console.log($scope.userid);

        $http.get(baseurl + 'buyerorders/'+$scope.BuyerId).success(function(data, status) {

            //console.log(data);

            $scope.orderlist = data;
        });

    }

     $scope.sellerorders = function(){


        $scope.SellerId =  window.sessionStorage.getItem('User_Id');

        //console.log($scope.userid);

        $http.get(baseurl + 'sellerorders/'+$scope.SellerId).success(function(data, status) {

            //console.log(data);

            $scope.orderlist = data;
        });

    }

    $scope.addtowishlist = function(){

      $('#addtowishlist').hide();

      if (window.sessionStorage.getItem('User_Id')<=0) 
      {
          window.location.href = "login.html";
      }
      else
      {
         $scope.wish = {}
         $scope.wish.ProductId = $scope.product.ProductId;
         $scope.wish.BuyerId =  window.sessionStorage.getItem('User_Id');

        //console.log($scope.userid);

        $http.post(baseurl + 'addtowishlist/',$scope.wish).success(function(data, status) {

            //console.log(data);
            $scope.added = 1;
            var wishlist =JSON.parse(sessionStorage.getItem("wishlist"));
            wishlist.push( $scope.product.ProductId);
            window.sessionStorage.setItem('wishlist',JSON.stringify(wishlist));
            $('#removefromwishlist').show();
        });

      }       

    }

    $scope.removefromwishlist = function(){

       $('#removefromwishlist').hide();
       $scope.wish = {}
         $scope.wish.ProductId = $scope.product.ProductId;
         $scope.wish.BuyerId =  window.sessionStorage.getItem('User_Id');

        //console.log($scope.userid);

        $http.post(baseurl + 'removefromwishlist/',$scope.wish).success(function(data, status) {

            //console.log(data);
            $scope.added = 0;
            var wishlist =JSON.parse(sessionStorage.getItem("wishlist"));
            var index = wishlist.indexOf($scope.product.ProductId);
            wishlist.splice(index, 1);
            window.sessionStorage.setItem('wishlist',JSON.stringify(wishlist));
            $('#addtowishlist').show();
        });
    }

    $scope.shortlistedproducts = function(){


        $scope.BuyerId =  window.sessionStorage.getItem('User_Id');

        //console.log($scope.userid);

        $http.get(baseurl + 'shortlistedproducts/'+$scope.BuyerId).success(function(data, status) {

            //console.log(data);

            $scope.productslist = data;
            $scope.wishlist = [] ;
            for(var i = 0; i < $scope.productslist.length; i++){
                var ProductId = $scope.productslist[i].ProductId;
                $scope.wishlist.push(ProductId);
            }
            window.sessionStorage.setItem('wishlist',JSON.stringify($scope.wishlist));
        });

    }


    $scope.getrecentproducts = function (req, res) {
        //alert("1");
          if (window.localStorage.getItem('Recent_Products')==null) 
            {   // alert("2");
                $scope.recentcount = 0;
            }
            else
            {
               //alert("3");
                $scope.recentcount = 1;
                $scope.items = JSON.parse(localStorage.getItem("Recent_Products"));
              //  console.log($scope.items);
                $scope.reproducts = {};
                $scope.commaproducts = "";
                var q = '';
                $.each($scope.items,function (index, value) { 
                         $scope.commaproducts += q+value;
                                q=',';
                        
                   });
              $scope.reproducts = {"recentProducts": $scope.commaproducts };

              console.log($scope.reproducts);


              $http.post(baseurl + 'getrecentprod',$scope.reproducts).success(function(data, status) {

           
                   $scope.recentproducts = data;

    
             
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
            $scope.product.orderqty = $scope.product.MinOrderQty;
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


            if (window.localStorage.getItem('Recent_Products')==null) 
            {
                var productarray = [];
                productarray.push(productId[1]);
                window.localStorage.setItem("Recent_Products", JSON.stringify(productarray));
            }
            else
            {
                var productarray = JSON.parse(localStorage.getItem("Recent_Products"));
                if (productarray.length>7) 
                {
                    productarray.shift();
                }
                if(productarray.indexOf(productId[1]) < 0) 
                {
                  productarray.push(productId[1]);
                  window.localStorage.setItem("Recent_Products", JSON.stringify(productarray));
                }
            }

       
      });

        $http.get(baseurl + 'getProductSpecification/'+$scope.product.productId).success(function(data, status) {

            $scope.specification = data;

      });

      $scope.added = 0;
      var wishlist =JSON.parse(sessionStorage.getItem("wishlist"));
      for (i = 0; i < wishlist.length; i++) {
         if (wishlist[i]==$scope.product.productId) 
         {
            $scope.added = 1;
         }
       }
    }
    else
    {
        location.href = "products.html";
    }

    }

  //    $scope.IsInWishlist = function (PId) {

  //     alert( $scope.ProductId);
  //     $scope.PId = PId;
  //     alert($scope.PId);
  //     $scope.added = 0
  //     var wishlist =JSON.parse(sessionStorage.getItem("wishlist"));
  //     for (i = 0; i < wishlist.length; i++) {
  //        alert(ProductId);
  //        if (wishlist[i]==ProductId) 
  //        {
  //           $scope.added = 1;
  //        }
  //   }
  
  // }


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

  $scope.conversation = function () {

      $scope.conversation = {};
      $scope.conversation.userid = window.sessionStorage.getItem('User_Id');
      $scope.conversation.OtherUserId = window.sessionStorage.getItem('Other_User_Id');
     // console.log($scope.conversation);
       
      $http.post(baseurl + 'conversation/',$scope.conversation).success(function(data, status) {

            $scope.conversation = data;
           // console.log($scope.conversation);
            
      });
  }

   $scope.conversationlist = function () {


      $scope.userid =  window.sessionStorage.getItem('User_Id');
       
      $http.get(baseurl + 'conversationlist/'+$scope.userid).success(function(data, status) {

           
           // console.log($scope.conversationlist);
            
           var url = window.location.href;
           var parts = url.split("?");
           if(parts.length>1){

                   $scope.conversationlist = data;
                   var urlparams = parts[1];
                   var urlpart = urlparams.split('&');
                   var id = urlpart[0].split('=');
                   //alert(id);
                   window.sessionStorage.setItem('Other_User_Id',id[1]);
                   $scope.conversation();
                   
            }
            else
            {
              $scope.conversationlist = data;
              window.sessionStorage.setItem('Other_User_Id',$scope.conversationlist[0].SupId);
              $scope.conversation();
            }

           // console.log($scope.OtherUserId);
      });
  
  }

   setInterval(function(){

                  
      var url = window.location.href;
      var parts = url.split("?");
      var pageurl = parts[0].split("/");
      var filename = pageurl.pop();
     // console.log(filename);
      if (filename == 'dashboard.html') 
      {
          $scope.userid =  window.sessionStorage.getItem('User_Id');
       
          $http.get(baseurl + 'conversationlist/'+$scope.userid).success(function(data, status) {

           
           // console.log($scope.conversationlist);

           
           if(parts.length>1){

                   $scope.conversationlist = data;
                   var urlparams = parts[1];
                   var urlpart = urlparams.split('&');
                   var id = urlpart[0].split('=');
                   //alert(id);
                   window.sessionStorage.setItem('Other_User_Id',id[1]);
                    $scope.conversation = {};
                    $scope.conversation.userid = window.sessionStorage.getItem('User_Id');
                    $scope.conversation.OtherUserId = window.sessionStorage.getItem('Other_User_Id');
                   // console.log($scope.conversation);
                     
                    $http.post(baseurl + 'conversation/',$scope.conversation).success(function(data, status) {

                          $scope.conversation = data;
                         // console.log($scope.conversation);
                    });
                   
            }
            else
            {
              $scope.conversationlist = data;
              window.sessionStorage.setItem('Other_User_Id',$scope.conversationlist[0].SupId);
              $scope.conversation = {};
                    $scope.conversation.userid = window.sessionStorage.getItem('User_Id');
                    $scope.conversation.OtherUserId = window.sessionStorage.getItem('Other_User_Id');
                   // console.log($scope.conversation);
                     
                    $http.post(baseurl + 'conversation/',$scope.conversation).success(function(data, status) {

                          $scope.conversation = data;
                         // console.log($scope.conversation);
                    });
            }

           // console.log($scope.OtherUserId);
      });
    }

    }, 30000)

   $scope.conversation = function () {

      $scope.conversation = {};
      $scope.conversation.userid = window.sessionStorage.getItem('User_Id');
      $scope.conversation.OtherUserId = window.sessionStorage.getItem('Other_User_Id');
     // console.log($scope.conversation);
       
      $http.post(baseurl + 'conversation/',$scope.conversation).success(function(data, status) {

            $scope.conversation = data;
           // console.log($scope.conversation);
            
      });
  }


  $scope.sendmessage = function (message) {

      $scope.message.userid = window.sessionStorage.getItem('User_Id');
      $scope.message.OtherUserId = window.sessionStorage.getItem('Other_User_Id');
     // console.log($scope.conversation);
       
      $http.post(baseurl + 'sendmessage/',$scope.message).success(function(data, status) {

           document.sendmsg.reset();
           var username = window.sessionStorage.getItem('User_Name');
           var content = "<li class='left clearfix'><span class='chat-img1 pull-left'><img src='uploads/ProfilePic/no-img.jpg' alt='User Avatar' class='img-circle'></span><div class='chat-body1 clearfix'><h6>"+username+"</h6><p>"+$scope.message.message+"</p><div class='chat_time pull-right'>"+data.date+"</div></div></li>";
           $('#chat_area').append(content);
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