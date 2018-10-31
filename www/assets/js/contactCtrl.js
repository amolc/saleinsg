app.filter('range', function () {
    return function (input, min, max, step) {
        min = parseInt(min); //Make string input int
        max = parseInt(max);
        // for (var i=min; i<max; i++)
        //   input.push(i);
        var i = min;
        while (i <= max) {
            input.push(i);
            i = i + min;
        }
        return input;
    };
});


app.controller('contactcontroller', function ($scope, $location, $http, $window) {
    $scope.data = {
        company_name: "",
        email: "",
        phone: "",
    }

    // $window.Stripe.setPublishableKey('pk_test_lTp89fhcIMVEFL2HSVRqJTHO');

    //----------- Book Now ------------------------///

    $scope.adults = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    $scope.child = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    // $scope.urlParams = $location.search();
    // console.log($location.search());

    $scope.getCountries = function () {
        $scope.registration = {};
        $http.get(baseurl + 'allcountries').success(function (res) {

            if (res.status == 'false') {

            } else {
                // console.log(res);
                $scope.countrylist = res;
                // $scope.registration.CountryId = $scope.countrylist[0].CountryId;
                //console.log($scope.countrylist);
            }

        }).error(function () {

        });

    }





    //pricing

    $scope.contactUS3 = function (code, result) {
        console.log($scope.data);
        if ($scope.data.company_name === "") {

            // angular.element(document.querySelector(".in_name")).addClass("has-error");
            $scope.myForm.company_name.$invalid = true;
            $scope.myForm.company_name.$pristine = false;
            /* console.log($scope.myForm.f_name.$invalid);  */
        }

        if ($scope.data.email === "") {
            //    			 angular.element(document.querySelector(".in_name")).addClass("has-error");
            $scope.myForm.email.$invalid = true;
            $scope.myForm.email.$pristine = false;
        }
        if ($scope.data.phone === "") {
            //    			 angular.element(document.querySelector(".in_name")).addClass("has-error");
            $scope.myForm.phone.$invalid = true;
            $scope.myForm.phone.$pristine = false;
        }

        if ($scope.company_name == "" && $scope.data.email == "" && $scope.data.phone == "") {

            $scope.msg = false;
            $scope.msg1 = true;
            $scope.message1 = "Please fill required field."

        } else {

            //    	  alert('calling the api');
            if ($scope.data.company_name != "" && $scope.data.email != "" && $scope.data.phone != "") {

                console.log($scope.company_name);

                $http.post(baseurl + 'contactus', $scope.data).success(function (res) {

                    $scope.response = res;
                    console.log(res);
                    $scope.formhide = true;
                    $scope.msg1 = true;
                    $scope.message = "Thank you for contacting us./nOur Team will contact you real soon.";
                    $scope.data = {
                        company_name: "",
                        email: "",
                        phone: "",

                    }
                    $scope.myForm.$setPristine();

                }).error(function () {
                    // alert("Please check your internet connection or data source..");
                });
            }
        }
    }


    ///____________________END______________________




















    $scope.register = function (formRegistration) {

        // console.log($scope.registration.CountryId);

        $scope.alertmessage = '';

        if (typeof $scope.registration.CountryId === 'undefined') {
            $scope.alertmessage = "Please Select Country";
            $("#alertmessage").show('slow');
        } else {

            var date = new Date();
            var messagedate = date.toLocaleDateString('en-GB', {
                timeZone: 'Asia/Singapore'
            });
            var messagetime = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Singapore'
            });
            $scope.registration.datetime = messagedate + ' ' + messagetime;
            $scope.registration.date = messagedate;
            // console.log("register IN");
            $http.post(baseurl + 'register', $scope.registration).success(function (data, status) {

                console.log('data', data)

                if (data.status == false) {
                    $scope.alertmessage = data.message;
                    $("#alertmessage").show('slow');
                } else {
                    document.formRegistration.reset();
                    $("#formRegistration").hide();
                    $("#thankyoudiv").show('slow');
                }

                //console.log('data',data)
            });

        }

    }



    $scope.verify = function () {
        //console.log('hi');
        $scope.data = {};
        var url = window.location.href;
        // console.log(url);
        var parts = url.split("?");
        if (parts.length > 0) {
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
            $scope.verificationstring = verificationstring[1];
            // $scope.tourtype = tourtype[1];
            $http.get(baseurl + 'verify-account/' + $scope.verificationstring).success(function (res) {
                if (res.status == 'false') {} else {
                    //console.log('Account verified Successfully');
                    window.location = "login.html";
                }
            }).error(function () {});
        }

    }

    $scope.login = function (logininfo, formLogin) {

        // console.log($scope.logininfo);

        $("#alertmessage").hide();

        $http.post(baseurl + 'login', $scope.logininfo).success(function (data, status) {

            console.log(data);

            //console.log('data', data.status);
            //console.log('result: ',data.value);
            // console.log(data.value.address);
            if (data.emailexist === false) {

                $scope.alertmessage = data.message;
                $("#alertmessage").show('slow');

            } else if (data.verifyValid === false) {

                $scope.alertmessage = data.message;
                $("#alertmessage").show('slow');

            } else {

                if (data.passValid === true) {

                    $scope.noemailpass = false;
                    $scope.noemail = false;
                    $scope.nopass = false;
                    $scope.loginFailure = false;
                    $scope.loginSuccess = true;

                    $scope.loginSuccessMsg = 'Successfully Login.';

                    // console.log(data);

                    window.localStorage.setItem('User_Id', data.value.SupId);
                    window.localStorage.setItem('User_Email', data.value.Email);
                    window.localStorage.setItem('User_Name', data.value.FirstName + ' ' + data.value.LastName);
                    window.localStorage.setItem('User_Phone', data.value.Phone);
                    window.localStorage.setItem('User_Location', data.value.CountryId);
                    window.localStorage.setItem('User_Image', data.value.ProfilePic);
                    //console.log(window.localStorage.getItem('UserId'));
                    //console.log(window.localStorage.getItem('UserId'));

                    // window.location = "../index.html";
                    if (window.localStorage.getItem("GoToPage") === null) {
                        window.location = "dashboard.html";
                    } else {
                        window.location = window.localStorage.getItem("GoToPage")
                    }

                } else {
                    $scope.alertmessage = data.message;
                    $("#alertmessage").show('slow');
                }


            }


        });


    }

    $scope.isLoggedin = function () {

        $scope.User_Id = 0;
        // console.log($scope.User_Id);

        //console.log(window.localStorage.getItem('User_Id'));
        if (window.localStorage.getItem('User_Id') > 0) {
            $scope.User_Id = window.localStorage.getItem('User_Id');
            $scope.User_Name = window.localStorage.getItem('User_Name');
            $scope.User_Image = window.localStorage.getItem('User_Image');
            if ($scope.User_Image == 'null') {
                $scope.User_Image = "no-img.jpg"
            }
        }
        // console.log($scope.User_Id);
        //alert($scope.User_Id);

    }


    $scope.getUserInfo = function () {

        $scope.User_Id = window.localStorage.getItem('User_Id');
        $http.get(baseurl + 'userinfo/' + $scope.User_Id).success(function (res) {

            if (res.status == 'false') {

            } else {
                //console.log(res);
                $scope.User = res;
                $scope.info = {};
                $scope.info.FirstName = res.FirstName;
                $scope.info.LastName = res.LastName;
                $scope.info.Email = res.Email;
                $scope.info.Phone = res.Phone;
                $scope.info.Location = res.Location;
                $scope.info.CompanyName = res.CompanyName;
                $scope.info.CountryId = res.CountryId;
                $scope.info.AccountName = res.AccountName;
                $scope.info.BankName = res.BankName;
                $scope.info.AccountNo = res.AccountNo;
                $scope.info.IFSCcode = res.IFSCcode;
                $scope.info.ProfilePic = res.ProfilePic;
                $scope.info.Password = res.Password;
                if ($scope.User.AccountName == null) {
                    $scope.User.AccountName = '-';
                    $scope.User.AccountNo = '-';
                    $scope.User.BankName = '-';
                    $scope.User.IFSCcode = '-';
                }
            }

        }).error(function () {

        });


    }

    $scope.updateprofile = function (info, attachment) {

        $scope.info.User_Id = window.localStorage.getItem('User_Id');
        $scope.info.attachment = attachment;
        // console.log($scope.info.attachment);
        // $scope.info.FirstName = $scope.FirstName;
        // $scope.info.LastName = $scope.LastName;
        // $scope.info.Email = $scope.Email;
        // $scope.info.Phone = $scope.Phone;
        // $scope.info.CompanyName = $scope.CompanyName;
        // $scope.info.CountryId = $scope.CountryId;
        // $scope.info.ProfilePic = $scope.ProfilePic;
        if (Object.keys($scope.info.attachment).length > 0) {
            $scope.info.image = $scope.info.attachment.images[0];
        } else {
            $scope.info.image = '';
        }
        // //console.log($scope.info);

        $http.post(baseurl + 'updateprofile', $scope.info).success(function (data, status) {

            console.log('data', data)

            if (data.status == false) {
                // $scope.alertmessage=data.message;
                // $("#alertmessage").show('slow');
            } else {
                document.editprofile.reset();
                window.localStorage.setItem('User_Image', data.value)
                window.location.href = "my-profile.html";

                //$("#formRegistration").hide();
                //$("#thankyoudiv").show('slow');
            }

            //console.log('data',data)
        });

    }

    $scope.updatebankdetails = function (info) {

        $scope.info.User_Id = window.localStorage.getItem('User_Id');

        $http.post(baseurl + 'updatebankdetails', $scope.info).success(function (data, status) {

            //      console.log('data',data)

            if (data.status == false) {
                // $scope.alertmessage=data.message;
                // $("#alertmessage").show('slow');
            } else {
                document.editbankdetails.reset();
                window.location.href = "my-profile.html";
                //$("#formRegistration").hide();
                //$("#thankyoudiv").show('slow');
            }

            //console.log('data',data)
        });

    }

    $scope.updatepassword = function (info) {

        $scope.info.User_Id = window.localStorage.getItem('User_Id');

        if (info.Password != info.opassword) {
            //$scope.alertmessage='Old Password Is Incorrect';
            $("#alertmessage").html('Old Password Is Incorrect');
            $("#alertmessage").show('slow');
        } else if (info.npassword != info.cpassword) {
            // $scope.alertmessage='Password And Confirm Password Should Be Same';
            $("#alertmessage").html('Password And Confirm Password Should Be Same');
            $("#alertmessage").show('slow');
        } else {

            $http.post(baseurl + 'updatepassword', $scope.info).success(function (data, status) {

                //      console.log('data',data)

                if (data.status == false) {
                    // $scope.alertmessage=data.message;
                    // $("#alertmessage").show('slow');
                } else {
                    document.editpassword.reset();
                    window.location.href = "my-profile.html";
                    //$("#formRegistration").hide();
                    //$("#thankyoudiv").show('slow');
                }

                //console.log('data',data)
            });

        }



    }

    $scope.logout = function () {

        //window.localStorage.clear();
        window.localStorage.removeItem('User_Id');
        window.localStorage.removeItem('User_Email');
        window.localStorage.removeItem('User_Name');
        window.localStorage.removeItem('User_Phone');
        window.localStorage.removeItem('User_Location');
        window.localStorage.removeItem('wishlist');
        window.localStorage.removeItem('Other_User_Id');
        window.localStorage.removeItem('User_Image');
        location.href = "index.html"
    }

    // All Categories

    $scope.getCategories = function () {
        console.log('for categories call is here')
        $scope.product = {};
        $scope.product.SubCatId = 0;
        $scope.subcatlist = {};
        $http.get(baseurl + 'allcategories').success(function (res) {

            if (res.status == 'false') {

            } else {
                // console.log(res);
                $scope.categorieslist = res;
                // $scope.registration.CountryId = $scope.countrylist[0].CountryId;
                //console.log($scope.categorieslist);
            }

        }).error(function () {

        });

    };

    // All Sub Ctegory

    $scope.getSubCat = function () {

        $http.get(baseurl + 'getsubcategories/' + $scope.product.CategoryId).success(function (res) {

            if (res.status == 'false') {

            } else {
                // console.log(res);
                $scope.subcatlist = res;
                // console.log($scope.subcatlist);
                // $scope.registration.CountryId = $scope.countrylist[0].CountryId;
                //console.log($scope.categorieslist);
            }

        }).error(function () {

        });

    };

    $scope.getSubCatlist = function (CategoryId) {
        var url = window.location.href;
        console.log(url);
        var parts = url.split("?");
        console.log(parts.length);
        if (parts.length > 1) {
            console.log('for sub categories call is here');
            var urlparams = parts[1];
            console.log(urlparams);

            // var urlpart = urlparams.split("&");
            // console.log(urlpart);
            var urlPara = urlparams.split("=");
            var catId = urlPara[1];
            console.log(catId);
            // $scope.catId = CategoryId;
            // console.log($scope.catId);
            //alert(CategoryId);
            $http.get(baseurl + 'getsubcategories/' + catId).success(function (res) {
                if (res.status == 'false') {} else {
                    // console.log(res);
                    $scope.subcatlist = res;
                    console.log('result of sub cate: ', $scope.subcatlist);
                    // $scope.registration.CountryId = $scope.countrylist[0].CountryId;
                    //console.log($scope.categorieslist);
                }

            }).error(function () {

            });

        }

    };

    var attachmentfile1 = [];
    var filelength;

    $scope.fileinit = function (ele) {

        $scope.info = {};
        $scope.product = {};
        $scope.attachmentCount = {};
        $scope.attachment = {};
        $scope.imgSrc = "";

    };

    $scope.updateattachment = function (file_browse) {

        var fileDisplayArea = document.getElementById('fileDisplayArea');
        // console.log(fileDisplayArea)
        if (file_browse == 'file_browse1') {
            var newfile = document.getElementById("file_browse1").files;
        }
        var imageType = /image.*/;

        function readAndPreview(file) {

            // Make sure `file.name` matches our extensions criteria
            if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
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
                    $scope.info.ProfilePic = file.name;

                    /*if(filelength==index){
                      callback(attachmentfile1);
                    }*/
                    imagepreview.appendChild(image);
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

            [].forEach.call(newfile, readAndPreview);
            setTimeout(function () {
                //console.log(attachmentfile1.length);
                $scope.attachment.images = attachmentfile1;
                //$scope.userdetails.profile_image = attachmentfile1[0];
                $scope.attachmentCount.imagecount = attachmentfile1.length;
                //$scope.parameters.attachment = "testes testett";//{images:attachmentfile1};
                //$scope.parameters.attachment = JSON.stringify(images);
                //$scope.addProduct($scope.parameters);
                //console.log(attachmentfile1);
            }, 1000);

        }

    }


    $scope.requestproduct = function (product) {

        // console.log($scope.product);


        if (typeof $scope.product.CategoryId === 'undefined') {
            $scope.alertmessage = "Please Select Category";
            $("#alertmessage").show('slow');
        } else {

            $scope.product.UserId = window.localStorage.getItem('User_Id');
            $scope.product.BuyerEmail = window.localStorage.getItem('User_Email');

            $scope.product.CountryId = parseInt(window.localStorage.getItem('User_Location'));
            $http.get(baseurl + 'getcountry/' + $scope.product.CountryId).success(function (data, status) {
                // console.log(data);
                $scope.product.buyercountry = data.CountryTitle;
                $scope.product.fullname = window.localStorage.getItem('User_Name');
                var date = new Date();
                var date1 = date.toLocaleDateString('en-GB', {
                    timeZone: 'Asia/Singapore'
                });
                var datetime = date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'Asia/Singapore'
                });
                dateToday = date1 + ' ' + datetime;
                $scope.product.date = date1;
                // console.log($scope.attachment.images);
                if (Object.keys($scope.attachment).length > 0) {
                    $scope.product.image = $scope.attachment.images[0];
                } else {
                    $scope.product.image = '';
                }

                // console.log($scope.product);

                $http.post(baseurl + 'requestproduct/', $scope.product).success(function (res) {

                    $('#imagepreview').children().remove();
                    $('.form-group select').val('');

                    document.addproduct.reset();
                    $("#addproduct").hide();
                    // $scope.spec = {};
                    // $scope.spec.ProductId = res.value;
                    $("#thankyoudiv").show('slow');


                }).error(function () {
                    // alert("Please check your internet connection or data source..");
                });

            });


        }

    }



    $scope.saveproduct = function (product) {

        // console.log($scope.product);


        if (typeof $scope.product.CategoryId === 'undefined') {
            $scope.alertmessage = "Please Select Category";
            $("#alertmessage").show('slow');
        } else {

            $scope.product.CountryId = window.localStorage.getItem('User_Location');
            $scope.product.UserId = window.localStorage.getItem('User_Id');
            $scope.product.SupEmail = window.localStorage.getItem('User_Email');
            var date = new Date();
            var date1 = date.toLocaleDateString('en-GB', {
                timeZone: 'Asia/Singapore'
            });
            var datetime = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Singapore'
            });
            dateToday = date1 + ' ' + datetime;
            $scope.product.date = date1;
            // console.log($scope.attachment.images);
            if (Object.keys($scope.attachment).length > 0) {
                $scope.product.image = $scope.attachment.images[0];
            } else {
                $scope.product.image = '';
            }

            $http.post(baseurl + 'addproduct/', $scope.product).success(function (res) {

                $('#imagepreview').children().remove();
                $('.form-group select').val('');

                document.addproduct.reset();
                $("#addproduct").hide();
                $scope.spec = {};
                $scope.spec.ProductId = res.value;
                $("#specification").show('slow');


            }).error(function () {
                // alert("Please check your internet connection or data source..");
            });

        }

    }

    $scope.updateproduct = function (product) {

        // console.log($scope.product);


        //   if(typeof $scope.product.CategoryId === 'undefined'){
        //    $scope.alertmessage="Please Select Country";
        //    $("#alertmessage").show('slow');
        //   }
        //   else{

        //   $scope.product.CountryId = window.localStorage.getItem('User_Location');
        //   $scope.product.UserId = window.localStorage.getItem('User_Id');
        //   $scope.product.SupEmail = window.localStorage.getItem('User_Email');
        // // console.log($scope.attachment.images);
        if (Object.keys($scope.attachment).length > 0) {
            $scope.product.image = $scope.attachment.images[0];
        } else {
            $scope.product.image = '';
        }

        $http.post(baseurl + 'updateproduct/', $scope.product).success(function (res) {

            $scope.alertmessage = "Saved Successfully";
            $("#alertmessage").show('slow');


        }).error(function () {
            // alert("Please check your internet connection or data source..");
        });

    }

    $scope.showSpecification = function (index, SpecificationId) {

        //console.log(revenueindex);
        $scope.index = index;
        $scope.SpecificationId = SpecificationId;
        $http.get(baseurl + 'showSpecification/' + $scope.SpecificationId).success(function (data, status) {

            $scope.spec = data;

        });
    }

    $scope.deleteSpecification = function (index, SpecificationId) {

        //console.log(revenueindex);
        var r = confirm("Are You Sure You want to Delete It?");
        if (r == true) {
            // console.log(id);
            $scope.index = index;
            $scope.SpecificationId = SpecificationId;
            $http.get(baseurl + 'deleteSpecification/' + $scope.SpecificationId).success(function (data, status) {
                $scope.specification.splice(index, 1);
            });

        }

    }


    $scope.specedit = function (spec, product) {

        $scope.spec.ProductId = $scope.product.ProductId;

        $http.post(baseurl + 'specedit', $scope.spec).success(function (data, status) {

            if (data.status == true) {
                document.addproduct2.reset();
                if (data.message == 'update')
                    $scope.specification[$scope.index] = $scope.spec;
                if (data.message == 'add')
                    $scope.specification.push($scope.spec);

                $scope.spec = {};

            } else {
                console.log('could not update details');
            }
        });

    }

    $scope.savespecification = function (spec) {


        $http.post(baseurl + 'addspecification/', $scope.spec).success(function (res) {


            document.addproduct2.reset();

            var rowCount = $('#specificationtable >tr').length + 1;

            var rowappend = "<tr><td>" + rowCount + "</td><td>" + $scope.spec.Title + "</td><td>" + $scope.spec.Description + "</td></tr>";

            $("#specificationtable").append(rowappend);



        }).error(function () {
            // alert("Please check your internet connection or data source..");
        });

    }



    // Product Page

    $scope.allproducts = function (req, res) {
        var previous = document.referrer;
        var fullpath = previous.split("?");
        var pageurl = fullpath[0].split("/");
        var filename = pageurl.pop();
        console.log(filename);

        if (filename !== 'products.html') {
            window.localStorage.removeItem('filter_country');
            window.localStorage.removeItem('filter_category');
            window.localStorage.removeItem('filter_subcat');
            window.localStorage.removeItem('filter_seller');
        }


        $scope.filter = {};
        var url = window.location.href;
        console.log(url);
        var parts = url.split("?");
        console.log(parts);
        console.log(parts.length);
        if (parts.length > 1) {
            var urlparams = parts[1];
            console.log(urlparams);
            var urlpart = urlparams.split('&');
            console.log(urlpart);
            console.log(urlpart.length);
            if (urlpart.length == 1) {
                //alert(urlpart);
                var id = urlpart[0].split('=');
                //alert(type[1]);
                console.log(id);
                if (id[0] == 'category') {
                    $http.get(baseurl + 'filterbycategory/' + id[1]).success(function (data, status) {
                        $scope.productslist = data;
                        window.localStorage.setItem('filter_category', id[1]);
                        $scope.CategoryId = id[1];
                    });

                } else if (id[0] == 'country') {
                    $http.get(baseurl + 'filterbycountry/' + id[1]).success(function (data, status) {
                        $scope.productslist = data;
                        window.localStorage.setItem('filter_country', id[1]);
                        $scope.CountryId = id[1];
                    });

                } else if (id[0] == 'seller') {
                    console.log('seller id req');
                    $http.get(baseurl + 'filterbyseller/' + id[1]).success(function (data, status) {
                        $scope.productslist = data;
                        window.localStorage.setItem('filter_seller', id[1]);
                        $scope.SellerId = id[1];
                        $http.get(baseurl + 'getsellerinfo/' + $scope.SellerId).success(function (data, status) {
                            $scope.seller = data;
                        });
                    });
                }

                if (window.localStorage.getItem('filter_country'))
                    $scope.CountryId = window.localStorage.getItem('filter_country');
                if (window.localStorage.getItem('filter_category'))
                    $scope.CategoryId = window.localStorage.getItem('filter_category');
                if (window.localStorage.getItem('filter_seller'))
                    $scope.SellerId = window.localStorage.getItem('filter_seller');
                console.log($scope.CountryId);

            } else if (urlpart.length == 2) {

                var urlparams = parts[1];

                var urlpart = urlparams.split('&');
                //alert(urlpart);
                var id1 = urlpart[0].split('=');
                var id2 = urlpart[1].split('=');
                //alert(type[1]);
                //alert(id1[0]);
                if (id1[0] == 'country' && id2[0] == 'category') {

                    $scope.filter.CountryId = id1[1];
                    $scope.filter.CategoryId = id2[1];
                    console.log(baseurl + 'filterbyCouCat');
                    console.log($scope.filter);
                    $http.post(baseurl + 'filterbyCouCat', $scope.filter).success(function (data, status) {

                        $scope.productslist = data;
                        window.localStorage.setItem('filter_country', id1[1]);
                        window.localStorage.setItem('filter_category', id2[1]);
                        $scope.CountryId = id1[1];
                        $scope.CategoryId = id2[1];
                    });

                    if (window.localStorage.getItem('filter_country'))
                        $scope.CountryId = window.localStorage.getItem('filter_country');
                    if (window.localStorage.getItem('filter_category'))
                        $scope.CategoryId = window.localStorage.getItem('filter_category');

                }

                if (id1[0] == 'category' && id2[0] == 'subcategory') {
                    console.log('filter by cat sub cat call is here in controller');
                    console.log('cat id is:', id1[1]);
                    console.log('subcat id is:', id2[1]);

                    $scope.filter.CategoryId = id1[1];
                    $scope.filter.SubCatId = id2[1];
                    console.log($scope.filter);
                    $http.post(baseurl + 'filterbyCatSub' + '/' + id1[1] + '/' + id2[1], $scope.filter).success(function (data, status) {

                        $scope.productslist = data;
                        window.localStorage.setItem('filter_category', id1[1]);
                        window.localStorage.setItem('filter_subcat', id2[1]);
                        $scope.CategoryId = id1[1];
                        $scope.SubCatId = id2[1];
                    });

                    if (window.localStorage.getItem('filter_category'))
                        $scope.CategoryId = window.localStorage.getItem('filter_category');
                    if (window.localStorage.getItem('filter_subcat'))
                        $scope.SubCatId = window.localStorage.getItem('filter_subcat');

                }

                if (id1[0] == 'seller' && id2[0] == 'category') {

                    $scope.filter.SellerId = id1[1];
                    $scope.filter.CategoryId = id2[1];
                    $http.post(baseurl + 'filterbySelCat', $scope.filter).success(function (data, status) {

                        $scope.productslist = data;
                        window.localStorage.setItem('filter_seller', id1[1]);
                        window.localStorage.setItem('filter_category', id2[1]);
                        $scope.SellerId = id1[1];
                        $scope.CategoryId = id2[1];
                        $http.get(baseurl + 'getsellerinfo/' + $scope.SellerId).success(function (data, status) {
                            $scope.seller = data;
                        });

                    });

                    if (window.localStorage.getItem('filter_seller'))
                        $scope.SellerId = window.localStorage.getItem('filter_seller');
                    if (window.localStorage.getItem('filter_category'))
                        $scope.CategoryId = window.localStorage.getItem('filter_category');

                }

            } else if (urlpart.length == 3) {
                //alert('hii');
                var urlparams = parts[1];

                var urlpart = urlparams.split('&');
                //alert(urlpart);
                var id1 = urlpart[0].split('=');
                var id2 = urlpart[1].split('=');
                var id3 = urlpart[2].split('=');
                //alert(type[1]);
                //alert(id1[0]);
                if (id1[0] == 'country' && id2[0] == 'category' && id3[0] == 'subcategory') {

                    $scope.filter.CountryId = id1[1];
                    $scope.filter.CategoryId = id2[1];
                    $scope.filter.SubCatId = id3[1];
                    $http.post(baseurl + 'filterbyall', $scope.filter).success(function (data, status) {

                        $scope.productslist = data;
                        window.localStorage.setItem('filter_country', id1[1]);
                        window.localStorage.setItem('filter_category', id2[1]);
                        window.localStorage.setItem('filter_subcat', id3[1]);
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
                if (id1[0] == 'seller' && id2[0] == 'category' && id3[0] == 'subcategory') {

                    $scope.filter.SellerId = id1[1];
                    $scope.filter.CategoryId = id2[1];
                    $scope.filter.SubCatId = id3[1];
                    $http.post(baseurl + 'filterallbyseller', $scope.filter).success(function (data, status) {

                        $scope.productslist = data;
                        window.localStorage.setItem('filter_seller', id1[1]);
                        window.localStorage.setItem('filter_category', id2[1]);
                        window.localStorage.setItem('filter_subcat', id3[1]);
                        $scope.SellerId = id1[1];
                        $scope.CategoryId = id2[1];
                        $scope.SubCatId = id3[1];
                        $http.get(baseurl + 'getsellerinfo/' + $scope.SellerId).success(function (data, status) {
                            $scope.seller = data;
                        });

                    });

                    if (window.localStorage.getItem('filter_seller'))
                        $scope.SellerId = window.localStorage.getItem('filter_seller');
                    if (window.localStorage.getItem('filter_category'))
                        $scope.CategoryId = window.localStorage.getItem('filter_category');
                    if (window.localStorage.getItem('filter_subcat'))
                        $scope.SubCatId = window.localStorage.getItem('filter_subcat');

                }

            }

        } else {
            console.log('call is here');
            $http.get(baseurl + 'allproducts').success(function (res) {
                if (res.status == 'false') {} else {
                    // console.log(res);
                    $scope.productslist = res;
                    console.log($scope.productslist);
                }
            }).error(function () {});
        }

    };



    $scope.productrequests = function () {

        $http.get(baseurl + 'productrequests').success(function (res) {

            if (res.status == 'false') {

            } else {
                // console.log(res);
                $scope.reqlist = res;
            }

        }).error(function () {

        });

    }

    $scope.buyerproductrequests = function () {

        $scope.userid = window.localStorage.getItem('User_Id');

        $http.get(baseurl + 'buyerproductrequests/' + $scope.userid).success(function (res) {

            if (res.status == 'false') {

            } else {
                // console.log(res);
                $scope.reqlist = res;
            }

        }).error(function () {

        });

    }

    $scope.userproducts = function () {

        $scope.userid = window.localStorage.getItem('User_Id');

        //console.log($scope.userid);

        $http.get(baseurl + 'userproducts/' + $scope.userid).success(function (data, status) {

            console.log(data);

            $scope.productslist = data;

            //  document.addStartupForm.reset();
            //  $('.form-group select').val('');
            //  console.log(data);

        });

    }



    $scope.disableProduct = function (ProductId) {

        // alert(ProductId);
        var url = document.location.href;
        var fullpath = url.split("?");
        var pageurl = fullpath[0].split("/");
        var filename = pageurl.pop();
        //console.log(filename);
        $scope.ProductId = ProductId;
        $http.get(baseurl + 'disableProduct/' + $scope.ProductId).success(function (data, status) {

            if (filename === 'seller-products.html')
                $scope.userproducts();
            else
                location.reload();
        });


    }

    $scope.enableProduct = function (ProductId) {

        // alert(ProductId);
        var url = document.location.href;
        var fullpath = url.split("?");
        var pageurl = fullpath[0].split("/");
        var filename = pageurl.pop();
        $scope.ProductId = ProductId;
        $http.get(baseurl + 'enableProduct/' + $scope.ProductId).success(function (data, status) {
            if (filename === 'seller-products.html')
                $scope.userproducts();
            else
                location.reload();
        });


    }

    $scope.buyerorders = function () {


        $scope.BuyerId = window.localStorage.getItem('User_Id');

        //console.log($scope.userid);

        $http.get(baseurl + 'buyerorders/' + $scope.BuyerId).success(function (data, status) {

            //console.log(data);

            $scope.orderlist = data;
        });

    }

    $scope.sellerorders = function () {


        $scope.SellerId = window.localStorage.getItem('User_Id');

        //console.log($scope.userid);

        $http.get(baseurl + 'sellerorders/' + $scope.SellerId).success(function (data, status) {

            //console.log(data);

            $scope.orderlist = data;
        });



    }

    $scope.addtowishlist = function () {

        $('#addtowishlist').hide();

        if (window.localStorage.getItem('User_Id') <= 0) {
            window.location.href = "login.html";
        } else {
            $scope.wish = {}
            $scope.wish.ProductId = $scope.product.ProductId;
            $scope.wish.BuyerId = window.localStorage.getItem('User_Id');

            //console.log($scope.userid);

            $http.post(baseurl + 'addtowishlist/', $scope.wish).success(function (data, status) {

                //console.log(data);
                $scope.added = 1;
                var wishlist = JSON.parse(localStorage.getItem("wishlist"));
                wishlist.push($scope.product.ProductId);
                window.localStorage.setItem('wishlist', JSON.stringify(wishlist));
                $('#removefromwishlist').show();
            });

        }

    }

    $scope.removefromwishlist = function () {

        $('#removefromwishlist').hide();
        $scope.wish = {}
        $scope.wish.ProductId = $scope.product.ProductId;
        $scope.wish.BuyerId = window.localStorage.getItem('User_Id');

        //console.log($scope.userid);

        $http.post(baseurl + 'removefromwishlist/', $scope.wish).success(function (data, status) {

            //console.log(data);
            $scope.added = 0;
            var wishlist = JSON.parse(localStorage.getItem("wishlist"));
            var index = wishlist.indexOf($scope.product.ProductId);
            wishlist.splice(index, 1);
            window.localStorage.setItem('wishlist', JSON.stringify(wishlist));
            $('#addtowishlist').show();
        });
    }

    $scope.shortlistedproducts = function () {


        $scope.BuyerId = window.localStorage.getItem('User_Id');

        //console.log($scope.userid);

        $http.get(baseurl + 'shortlistedproducts/' + $scope.BuyerId).success(function (data, status) {

            //console.log(data);

            $scope.productslist = data;
            $scope.wishlist = [];
            for (var i = 0; i < $scope.productslist.length; i++) {
                var ProductId = $scope.productslist[i].ProductId;
                $scope.wishlist.push(ProductId);
            }
            window.localStorage.setItem('wishlist', JSON.stringify($scope.wishlist));
        });

    }


    $scope.getrecentproducts = function (req, res) {
        //alert("1");
        if (window.localStorage.getItem('Recent_Products') == null) { // alert("2");
            $scope.recentcount = 0;
        } else {
            //alert("3");
            $scope.recentcount = 1;
            $scope.items = JSON.parse(localStorage.getItem("Recent_Products"));
            //  console.log($scope.items);
            $scope.reproducts = {};
            $scope.commaproducts = "";
            var q = '';
            $.each($scope.items, function (index, value) {
                $scope.commaproducts += q + value;
                q = ',';

            });
            $scope.reproducts = {
                "recentProducts": $scope.commaproducts
            };

            console.log($scope.reproducts);


            $http.post(baseurl + 'getrecentprod', $scope.reproducts).success(function (data, status) {


                $scope.recentproducts = data;



            });

        }

    }

    $scope.featuredseller = function (req, res) {


        $http.get(baseurl + 'featuredseller').success(function (data, status) {
            // console.log(data);
            $scope.sellerlist = data;

        });

    }



    $scope.getbuyerinfo = function (req, res) {


        User_Id = window.localStorage.getItem('User_Id');

        $http.get(baseurl + 'getsellerinfo/' + User_Id).success(function (data, status) {
            $scope.data = data;
            $scope.data.BuyerId = User_Id;
            $scope.data.Currency = 'SGD';
            $scope.data.changeCurrency = 'SGD';
            $scope.data.balance = $scope.balance;
            $scope.data.deposit = $scope.deposit;
            $scope.data.withdraw = $scope.withdraw;
            // console.log($scope.data);
        });

    }

    $scope.getsellerinfo = function (req, res) {


        User_Id = window.localStorage.getItem('User_Id');

        $http.get(baseurl + 'getsellerinfo/' + User_Id).success(function (data, status) {
            $scope.data = data;
            $scope.data.SupplierId = User_Id;
            $scope.data.amount = 50;
            // $scope.data.Currency = 'SGD';
            // $scope.data.changeCurrency = 'SGD';
            // $scope.data.balance = $scope.balance;
            // $scope.data.deposit = $scope.deposit;
            // $scope.data.withdraw = $scope.withdraw;
            // console.log($scope.data);
        });

    }

    $scope.gettransactions = function (req, res) {


        User_Id = window.localStorage.getItem('User_Id');

        $http.get(baseurl + 'gettransactions/' + User_Id).success(function (data, status) {

            $scope.transactionlist = data;
            //console.log($scope.transactionlist);
            if ($scope.transactionlist.length > 0) {
                $scope.balance = $scope.transactionlist[0].Balance;
            } else {
                $scope.balance = 0;
            }

            $scope.deposit = 0;
            $scope.withdraw = 0;
            $.each($scope.transactionlist, function (index, value) {
                //console.log(value);
                if (value.Type == 'Deposit') {
                    $scope.deposit = $scope.deposit + value.Amount;
                }
                if (value.Type == 'Withdraw') {
                    $scope.withdraw = $scope.withdraw + value.Amount;
                }
            });

        });

    }

    $scope.withdrawamonut = function () {

        $("#withsubmit").hide();

        // alert('hi');
        if ($scope.data.amount > $scope.balance) {

            $("#withsubmit").show();
            $scope.alertmessage = 'Please Enter Amount less that Balance';

        } else if ($scope.data.AccountNo !== $scope.data.ConfirmAccount) {

            $("#withsubmit").show();
            $scope.alertmessage = 'Account No And Confirm Account No Should Be Same.';

        } else {

            $scope.alertmessage = '';

            var date = new Date();
            var paydate = date.toLocaleDateString('en-GB', {
                timeZone: 'Asia/Singapore'
            });
            var paytime = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Singapore'
            });
            dateToday = paydate + ' ' + paytime;
            $scope.data.datetime = dateToday;
            $scope.data.date = paydate;
            $scope.data.type = 'Withdraw';
            $scope.data.balance = parseFloat($scope.balance) - parseFloat($scope.data.amount);
            $scope.data.withdraw = parseFloat($scope.withdraw) + parseFloat($scope.data.amount);
            $.getJSON('//api.ipify.org?format=jsonp&callback=?', function (data) {
                // response = JSON.stringify(data, null, 2);
                var response = data;
                $scope.data.ip = response.ip;
                console.log($scope.data);
                $http.post(baseurl + 'withdraw/', $scope.data).success(function (res) {

                    if (res.status == true) {

                        $("#withdraw").text($scope.data.withdraw);
                        $("#balance").text($scope.data.balance);

                        $("#payform").hide();
                        var content = '<tr> <td style="text-align: left; padding-left: 20px;">' + $scope.data.date + '</td><td>' + $scope.data.BankName + '</td><td>' + $scope.data.IFSCcode + '</td><td>' + $scope.data.AccountNo + '</td><td>SGD $' + $scope.data.amount + '</td></tr>';
                        $("#transactiontable").prepend(content);
                        $("#deplist").show();
                    } else {
                        $("#deposit").show();
                        $scope.paymessage = res.message;
                    }


                }).error(function () {

                });

            });



        }

    };


    $scope.enquiryinit = function (req, res) {

        //console.log($scope.enquiry);

        $scope.enquiry = {};

        var url = window.location.href;

        var parts = url.split("?");
        //console.log(parts.length);
        if (parts.length > 1) {
            var urlparams = parts[1];

            var urlpart = urlparams.split('&');
            var productId = urlpart[0].split('=');



            if (productId[0] == 'id') {


                $scope.enquiry.productId = productId[1];

                $http.get(baseurl + 'getProductDetails/' + $scope.enquiry.productId).success(function (data, status) {

                    $scope.enquiry = data;
                    $scope.enquiry.Type = data.ProductType;
                    if ($scope.enquiry.Type == 'Product') {
                        $scope.enquiry.productname = data.ProductName;
                        $scope.enquiry.SupName = data.SupFirstName + ' ' + data.SupLastName;
                        $scope.enquiry.SupId = data.SupplierId;
                        $scope.enquiry.SupEmail = data.SupEmail;
                        $scope.enquiry.BuyerId = 0;

                        if (window.localStorage.getItem('User_Id') > 0) {
                            $scope.enquiry.BuyerId = window.localStorage.getItem('User_Id');
                            $scope.enquiry.fullname = window.localStorage.getItem('User_Name');
                            $scope.enquiry.email = window.localStorage.getItem('User_Email');
                            $scope.enquiry.phonenumber = window.localStorage.getItem('User_Phone');
                        }

                    }
                    if ($scope.enquiry.Type == 'Request') {

                        // $scope.enquiry.productname = data.ProductName;
                        $scope.enquiry.BuyerName = data.SupFirstName + ' ' + data.SupLastName;
                        $scope.enquiry.BuyerId = data.BuyerId;
                        $scope.enquiry.BuyerEmail = data.SupEmail;
                        $scope.enquiry.BuyerCountry = data.CountryTitle;
                        if (window.localStorage.getItem('User_Id') > 0) {
                            $scope.enquiry.SupId = window.localStorage.getItem('User_Id');
                            $scope.enquiry.fullname = window.localStorage.getItem('User_Name');
                            $scope.enquiry.email = window.localStorage.getItem('User_Email');
                            $scope.enquiry.phonenumber = window.localStorage.getItem('User_Phone');

                        }

                        $http.get(baseurl + 'getbiddings/' + $scope.enquiry.productId).success(function (data, status) {


                            $scope.biddinglist = data;
                            //  console.log($scope.biddinglist);

                        });

                    }



                });

            } else if (productId[0] == 'reqid') {

                $scope.enquiry.productId = productId[1];

                //alert($scope.enquiry.productId);

                $http.get(baseurl + 'getReqProductDetails/' + $scope.enquiry.productId).success(function (data, status) {


                    $scope.enquiry.productname = data.ProductName;
                    $scope.enquiry.BuyerName = data.SupFirstName + ' ' + data.SupLastName;
                    $scope.enquiry.BuyerId = data.BuyerId;
                    $scope.enquiry.BuyerEmail = data.SupEmail;
                    $scope.enquiry.Type = 'Request';
                    if (window.localStorage.getItem('User_Id') > 0) {
                        $scope.enquiry.SupId = window.localStorage.getItem('User_Id');
                        $scope.enquiry.fullname = window.localStorage.getItem('User_Name');
                        $scope.enquiry.email = window.localStorage.getItem('User_Email');
                        $scope.enquiry.phonenumber = window.localStorage.getItem('User_Phone');
                    }

                });

            }
        } else {
            location.href = "products.html";
        }

    }

    $scope.getinfo = function (bid) {

        $scope.message = {};
        $scope.message.userid = window.localStorage.getItem('User_Id');
        $scope.message.OtherUserId = bid.SupplierId;
        $scope.message.ProductId = bid.ProductId;
        $('#myModal').modal('show');

    }

    $scope.bidinit = function (req, res) {

        //console.log($scope.enquiry);

        $scope.enquiry = {};

        var url = window.location.href;

        var parts = url.split("?");
        //console.log(parts.length);
        if (parts.length > 1) {
            var urlparams = parts[1];

            var urlpart = urlparams.split('&');
            var productId = urlpart[0].split('=');



            if (productId[0] == 'id') {


                $scope.enquiry.productId = productId[1];

                $http.get(baseurl + 'getReqProductDetails/' + $scope.enquiry.productId).success(function (data, status) {

                    $scope.enquiry = data;

                    console.log($scope.enquiry);

                    $scope.enquiry.BuyerName = data.SupFirstName + ' ' + data.SupLastName;
                    $scope.enquiry.BuyerId = data.BuyerId;
                    $scope.enquiry.BuyerEmail = data.SupEmail;
                    $scope.enquiry.BuyerCity = data.SupLocation;
                    $scope.enquiry.BuyerCountry = data.CountryTitle;
                    if (window.localStorage.getItem('User_Id') > 0) {
                        $scope.enquiry.SupId = window.localStorage.getItem('User_Id');
                        $scope.enquiry.fullname = window.localStorage.getItem('User_Name');
                        $scope.enquiry.email = window.localStorage.getItem('User_Email');
                        $scope.enquiry.phonenumber = window.localStorage.getItem('User_Phone');
                        var sellercountryId = parseInt(window.localStorage.getItem('User_Location'));
                        $http.get(baseurl + 'getcountry/' + sellercountryId).success(function (data, status) {
                            // console.log(data);
                            $scope.enquiry.sellercountry = data.CountryTitle;


                        });

                    }

                    $http.get(baseurl + 'getbiddings/' + productId[1]).success(function (data, status) {
                        // console.log(data);
                        $scope.biddinglist = data;

                    });




                });

            }

        } else {
            location.href = "index.html";
        }

    }

    $scope.productinit = function (req, res) {

        $scope.product = {};
        window.localStorage.setItem('index', 2);
        $scope.index = 2;
        $scope.product.term = {};
        $scope.product.type = {};
        $scope.product.percentage = {};
        $scope.product.amount = {};
        $scope.product.remove = {};

        var url = window.location.href;

        var parts = url.split("?");
        //console.log(parts.length);
        if (parts.length > 1) {
            var urlparams = parts[1];

            var urlpart = urlparams.split('&');
            var productId = urlpart[0].split('=');

            $scope.product.productId = productId[1];


            $http.get(baseurl + 'getProductDetails/' + $scope.product.productId).success(function (data, status) {

                $scope.product = data;
                if ($scope.product.ProductType == 'Request') {
                    var sellerid = urlpart[1].split('=');
                    $scope.product.BidId = sellerid[1];
                    $http.get(baseurl + 'bidinfo/' + $scope.product.BidId).success(function (data, status) {
                        //console.log(data);
                        $scope.product.SupplierId = data.SupId;
                        $scope.product.CompanyName = data.CompanyName;
                        $scope.product.CountryTitle = data.CountryTitle;
                        $scope.product.SupEmail = data.SupEmail;
                        $scope.product.SupFirstName = data.SupFirstName;
                        $scope.product.SupLastName = data.SupLastName;
                        $scope.product.Price = data.SellerPrice;
                        $scope.product.changePrice = data.SellerPrice;
                        $scope.amt = $scope.product.MinOrderQty * $scope.product.Price * $scope.per / 100;
                        $scope.amt1 = $scope.product.orderqty * $scope.product.Price * $scope.per / 100;

                    });
                }

                $scope.product.buyercountryId = parseInt(window.localStorage.getItem('User_Location'));
                $http.get(baseurl + 'getcountry/' + $scope.product.buyercountryId).success(function (data, status) {
                    // console.log(data);
                    $scope.product.buyercountry = data.CountryTitle;

                });

                //$scope.product.orderqty = $scope.product.MinOrderQty;
                if ($scope.product.ProductType == 'Request')
                    $scope.product.orderqty = $scope.product.Quantity;
                else
                    $scope.product.orderqty = 10;
                /*   $scope.product.changePrice = data.Price;
          $scope.product.changeCurrency = data.Currency;
          $scope.product.paymenttype = 'Credit Card';
          $scope.terms = "50% In Advance";
          $scope.types = "Trade Exchange Escrow (TEE)";
          $scope.per = 50;
          $scope.amt =  $scope.product.orderqty *  $scope.product.Price *  $scope.per / 100;
          $scope.terms1 = "50% Against Delivery";
          $scope.types1 = "Trade Exchange Escrow (TEE)";
          $scope.per1 = 50;
          $scope.amt1 =  $scope.product.orderqty *  $scope.product.Price *  $scope.per / 100;
          $scope.qty = [];
          for (var i = 1; i <=  $scope.product.Quantity; i++) {
             $scope.qty.push(i);
*/
                $scope.product.changePrice = data.Price;
                $scope.product.changeCurrency = data.Currency;
                $scope.product.paymenttype = 'Credit Card';
                $scope.terms = "100% In Advance";
                $scope.types = "Trade Exchange Escrow (TEE)";
                $scope.per = 100;
                $scope.amt = $scope.product.MinOrderQty * $scope.product.Price * $scope.per / 100;
                /* $scope.terms1 = "50% Against Delivery";  */
                /* $scope.types1 = "Trade Exchange Escrow (TEE)"; */
                /*  $scope.per1 = 50; */
                /*   $scope.amt1 =  $scope.product.orderqty *  $scope.product.Price *  $scope.per / 100;  */
                $scope.qty = [];
                for (var i = 1; i <= $scope.product.Quantity; i++) {
                    $scope.qty.push(i)

                }
                //  console.log($scope.qty);
                //console.log($scope.product.CategoryId);
                $http.get(baseurl + 'getsubcategories/' + $scope.product.CategoryId).success(function (res) {

                    if (res.status == 'false') {

                    } else {
                        // console.log(res);
                        $scope.subcatlist = res;
                        // console.log($scope.subcatlist);
                        // $scope.registration.CountryId = $scope.countrylist[0].CountryId;
                        //console.log($scope.categorieslist);
                    }

                }).error(function () {

                });


                if (window.localStorage.getItem('User_Id') > 0) {
                    $scope.product.BuyerId = window.localStorage.getItem('User_Id');
                    $scope.product.fullname = window.localStorage.getItem('User_Name');
                    $scope.product.email = window.localStorage.getItem('User_Email');
                    $scope.product.phonenumber = window.localStorage.getItem('User_Phone');
                }

                if (window.localStorage.getItem('Recent_Products') == null) {
                    var productarray = [];
                    productarray.push(productId[1]);
                    window.localStorage.setItem("Recent_Products", JSON.stringify(productarray));
                } else {
                    var productarray = JSON.parse(localStorage.getItem("Recent_Products"));
                    if (productarray.length > 7) {
                        productarray.shift();
                    }
                    if (productarray.indexOf(productId[1]) < 0) {
                        productarray.push(productId[1]);
                        window.localStorage.setItem("Recent_Products", JSON.stringify(productarray));
                    }
                }


            });

            $http.get(baseurl + 'getProductSpecification/' + $scope.product.productId).success(function (data, status) {

                $scope.specification = data;

            });


            $scope.added = 0;
            var wishlist = JSON.parse(localStorage.getItem("wishlist"));
            for (i = 0; i < wishlist.length; i++) {
                if (wishlist[i] == $scope.product.productId) {
                    $scope.added = 1;
                }
            }
        } else {
            location.href = "products.html";
        }

    }

    $scope.sellerorder = function (req, res) {

        $scope.order = {};

        var url = window.location.href;

        var parts = url.split("?");
        //console.log(parts.length);
        if (parts.length > 1) {
            var urlparams = parts[1];

            var urlpart = urlparams.split('&');
            var OrderId = urlpart[0].split('=');

            $scope.order.OrderId = OrderId[1];
            $scope.order.SupplierId = parseInt(window.localStorage.getItem('User_Id'));
            //console.log($scope.order.OrderId);
            //$http.get(baseurl + 'getOrderDetails/'+$scope.order.OrderId).success(function(data, status) {
            $http.post(baseurl + 'GetOrderDetails', $scope.order).success(function (data, status) {
                // console.log(data);

                $scope.order = data;
                $http.get(baseurl + 'getTerms/' + $scope.order.OrderId).success(function (data, status) {

                    $scope.termslist = data;
                    $scope.termsli = {};
                    $scope.termsli = $scope.termslist;
                    //  console.log($scope.termslist);

                });

                $http.get(baseurl + 'getHistory/' + $scope.order.OrderId).success(function (data, status) {

                    // console.log(data);
                    $scope.historylist = data;

                });

                var sellercountryId = parseInt(window.localStorage.getItem('User_Location'));
                $http.get(baseurl + 'getcountry/' + sellercountryId).success(function (data, status) {
                    // console.log(data);
                    $scope.order.sellercountry = data.CountryTitle;
                    $scope.order.sellername = window.localStorage.getItem('User_Name');
                    $scope.order.selleremail = window.localStorage.getItem('User_Email');

                });

            });




        } else {
            location.href = "seller-orders.html";
        }

    }

    $scope.buyerorder = function (req, res) {

        $scope.order = {};

        var url = window.location.href;

        var parts = url.split("?");
        //console.log(parts.length);
        if (parts.length > 1) {
            var urlparams = parts[1];

            var urlpart = urlparams.split('&');
            var OrderId = urlpart[0].split('=');

            $scope.order.OrderId = OrderId[1];
            $scope.order.BuyerId = parseInt(window.localStorage.getItem('User_Id'));
            //console.log($scope.order.OrderId);
            //$http.get(baseurl + 'getbuyerOrderDetails/'+$scope.order.OrderId).success(function(data, status) {
            $http.post(baseurl + 'GetbuyerOrderDetails', $scope.order).success(function (data, status) {


                // console.log(data);

                $scope.order = data;
                $http.get(baseurl + 'getTerms/' + $scope.order.OrderId).success(function (data, status) {

                    $scope.termslist = data;
                    $scope.termsli = {};
                    $scope.termsli = $scope.termslist;
                    $scope.bankdetails = 0;
                    //  console.log($scope.termslist);
                    $.each($scope.termslist, function (index, value) {

                        //console.log(value.Type);
                        if (value.Type == "Telegraphic Transfer (TT)" || value.Type == "Letter Of Credit (LOC)") {
                            $scope.bankdetails = 1;
                        }
                    });

                    if ($scope.bankdetails == 1) {

                        $http.get(baseurl + 'getBankDetails/' + $scope.order.SuplierId).success(function (data, status) {

                            console.log(data);
                            $scope.bank = data;
                        });
                    }

                });

                $http.get(baseurl + 'getHistory/' + $scope.order.OrderId).success(function (data, status) {

                    //console.log(data);
                    $scope.historylist = data;

                });

                var buyercountryId = parseInt(window.localStorage.getItem('User_Location'));
                $http.get(baseurl + 'getcountry/' + buyercountryId).success(function (data, status) {
                    // console.log(data);
                    $scope.order.buyercountry = data.CountryTitle;
                    $scope.order.buyername = window.localStorage.getItem('User_Name');
                    $scope.order.buyeremail = window.localStorage.getItem('User_Email');

                });

            });

        } else {
            location.href = "buyer-orders.html";
        }

    }



    $scope.payNow = function (OrderId, TermId, PayAmount, Currency) {

        //alert(OrderId);
        User_Id = window.localStorage.getItem('User_Id');

        $http.get(baseurl + 'gettransactions/' + User_Id).success(function (data, status) {

            $scope.transactionlist = data;

            //console.log($scope.transactionlist);
            if ($scope.transactionlist.length > 0) {
                $scope.balance = $scope.transactionlist[0].Balance;

                $scope.currency = {};
                $scope.currency.amount = PayAmount;
                $scope.currency.baseCurrency = Currency;
                $scope.currency.changeCurrency = 'SGD';


                $http.post(baseurl + 'changeCurrency/', $scope.currency).then(function (res, status) {


                    // console.log(res);

                    if (res.status == 200) {
                        $scope.Charge = res.data.converted;
                        //console.log(res.data.converted);
                        if ($scope.balance <= 0 || $scope.balance < res.data.converted) {
                            window.location.href = "deposit-form.html";
                        } else {
                            $scope.order = {}
                            $scope.order.OrderId = OrderId;
                            $scope.order.BuyerId = parseInt(window.localStorage.getItem('User_Id'));
                            $scope.order.balance = $scope.balance;

                            //console.log($scope.order);

                            $http.post(baseurl + 'GetbuyerOrderDetails', $scope.order).success(function (data, status) {

                                $scope.order = data;
                                $http.get(baseurl + 'getTerms/' + $scope.order.OrderId).success(function (data1, status) {

                                    $scope.order.terms = data1;

                                    var buyercountryId = parseInt(window.localStorage.getItem('User_Location'));
                                    $http.get(baseurl + 'getcountry/' + buyercountryId).success(function (data2, status) {
                                        // console.log(data);
                                        $scope.order.buyercountry = data2.CountryTitle;
                                        $scope.order.buyername = window.localStorage.getItem('User_Name');
                                        $scope.order.buyeremail = window.localStorage.getItem('User_Email');
                                        //console.log($scope.order);

                                        var date = new Date();
                                        var paydate = date.toLocaleDateString('en-GB', {
                                            timeZone: 'Asia/Singapore'
                                        });
                                        var paytime = date.toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            timeZone: 'Asia/Singapore'
                                        });
                                        dateToday = paydate + ' ' + paytime;
                                        $scope.order.datetime = dateToday;
                                        $scope.order.date = paydate;
                                        $scope.order.type = 'Withdraw';
                                        $scope.order.balance = parseFloat($scope.balance) - parseFloat(res.data.converted);
                                        $.getJSON('//api.ipify.org?format=jsonp&callback=?', function (data4) {
                                            // response = JSON.stringify(data, null, 2);
                                            var response = data4;
                                            $scope.order.ip = response.ip;
                                            $scope.order.Charge = res.data.converted;
                                            $scope.order.TermId = TermId;
                                            console.log($scope.order);
                                            $http.post(baseurl + 'payNow/', $scope.order).success(function (res) {

                                                if (res.status == true) {

                                                    if (res.count == 0)
                                                        window.location.href = "buyer-orders.html";
                                                    else if (res.count == 1)
                                                        window.location.href = "buyer-order-details.html?id=" + $scope.order.OrderId;

                                                } else {
                                                    alert('Please Try After Some Time')
                                                }


                                            }).error(function () {

                                            });

                                        });

                                    });

                                });

                            });

                        }

                    }



                });


            } else {
                window.location.href = "deposit-form.html";
            }

        });



    }


    $scope.showterms = function () {

        $("#label").show();
        var index = parseInt(window.localStorage.getItem('index'));
        //alert(index);
        // var content = "<div class='form-group'><div class='col-md-4'><input class='form-group form-control' type='text' ng-model='product.term["+index+"]'></div><div class='col-md-4'><input class='form-group form-control' type='text' ng-model='product.type["+index+"]'></div><div class='col-md-2'><input class='form-group form-control' type='text' ng-model='product.percentage["+index+"]'></div><div class='col-md-2'><input class='form-group form-control' type='text' ng-model='product.amount["+index+"]'></div></div>";
        $("#termsdiv" + index).show();
        if (typeof $scope.product.remove === 'undefined') {
            $scope.product.remove = {};
            $scope.product.type = {};
        }
        $scope.product.remove[index] = 0;
        $scope.product.type[index] = $scope.types;
        index = index + 1;
        window.localStorage.setItem('index', index);
    }

    $scope.sellerterms = function () {

        //alert('hi');
        //console.log($scope.termsli);
        var sellercountryId = parseInt(window.localStorage.getItem('User_Location'));
        $http.get(baseurl + 'getcountry/' + sellercountryId).success(function (data, status) {
            // console.log(data);
            $scope.order.sellercountry = data.CountryTitle;
            $scope.order.sellername = window.localStorage.getItem('User_Name');
            $scope.order.selleremail = window.localStorage.getItem('User_Email');

            var orderId = $scope.order.OrderId;
            var date = new Date();
            var messagedate = date.toLocaleDateString('en-GB', {
                timeZone: 'Asia/Singapore'
            });
            var messagetime = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Singapore'
            });
            dateToday = messagedate + ' ' + messagetime;
            $scope.data = {};
            $scope.data.order = $scope.order;
            $scope.data.terms = $scope.termsli;
            $scope.data.datetime = dateToday;
            $scope.data.date = messagedate;
            $scope.data.date = messagedate;
            $scope.data.OrderId = orderId;
            // console.log($scope.data);
            $http.post(baseurl + 'sellerTerms/', $scope.data).success(function (data, status) {

                console.log(data);

                window.location.href = 'seller-order-details.html?id=' + orderId;

            });

        });

    }

    $scope.buyerterms = function () {

        //alert('hi');
        //console.log($scope.termsli);
        var buyercountryId = parseInt(window.localStorage.getItem('User_Location'));
        $http.get(baseurl + 'getcountry/' + buyercountryId).success(function (data, status) {
            // console.log(data);
            $scope.order.buyercountry = data.CountryTitle;
            $scope.order.buyername = window.localStorage.getItem('User_Name');
            $scope.order.buyeremail = window.localStorage.getItem('User_Email');

            var orderId = $scope.order.OrderId;
            var date = new Date();
            var messagedate = date.toLocaleDateString('en-GB', {
                timeZone: 'Asia/Singapore'
            });
            var messagetime = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Singapore'
            });
            dateToday = messagedate + ' ' + messagetime;
            $scope.data = {};
            $scope.data.order = $scope.order;
            $scope.data.terms = $scope.termsli;
            $scope.data.datetime = dateToday;
            $scope.data.date = messagedate;
            $scope.data.date = messagedate;
            $scope.data.OrderId = orderId;
            // console.log($scope.data);
            $http.post(baseurl + 'buyerTerms/', $scope.data).success(function (data, status) {

                console.log(data);

                window.location.href = 'buyer-order-details.html?id=' + orderId;

            });
        });

    }

    $scope.sellerapprove = function () {

        //alert('hi');
        //console.log($scope.termsli);
        var sellercountryId = parseInt(window.localStorage.getItem('User_Location'));
        $http.get(baseurl + 'getcountry/' + sellercountryId).success(function (data, status) {
            // console.log(data);
            $scope.order.sellercountry = data.CountryTitle;
            $scope.order.sellername = window.localStorage.getItem('User_Name');
            $scope.order.selleremail = window.localStorage.getItem('User_Email');
            var orderId = $scope.order.OrderId;
            var date = new Date();
            var messagedate = date.toLocaleDateString('en-GB', {
                timeZone: 'Asia/Singapore'
            });
            var messagetime = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Singapore'
            });
            dateToday = messagedate + ' ' + messagetime;
            $scope.data = {};
            $scope.data.terms = $scope.termslist;
            $scope.data.order = $scope.order;
            $scope.data.datetime = dateToday;
            $scope.data.date = messagedate;
            $scope.data.date = messagedate;

            //console.log($scope.data);
            $http.post(baseurl + 'sellerapprove/', $scope.data).success(function (data, status) {

                window.location.href = 'seller-order-details.html?id=' + orderId;

            });

        });


    }

    $scope.buyerapprove = function () {

        //alert('hi');
        //console.log($scope.termsli);
        var buyercountryId = parseInt(window.localStorage.getItem('User_Location'));
        $http.get(baseurl + 'getcountry/' + buyercountryId).success(function (data, status) {
            // console.log(data);
            $scope.order.buyercountry = data.CountryTitle;
            $scope.order.buyername = window.localStorage.getItem('User_Name');
            $scope.order.buyeremail = window.localStorage.getItem('User_Email');
            var orderId = $scope.order.OrderId;
            var date = new Date();
            var messagedate = date.toLocaleDateString('en-GB', {
                timeZone: 'Asia/Singapore'
            });
            var messagetime = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Singapore'
            });
            dateToday = messagedate + ' ' + messagetime;
            $scope.data = {};
            $scope.data.terms = $scope.termslist;
            $scope.data.order = $scope.order;
            $scope.data.datetime = dateToday;
            $scope.data.date = messagedate;
            $scope.data.date = messagedate;

            //console.log($scope.data);
            $http.post(baseurl + 'buyerapprove/', $scope.data).success(function (data, status) {

                window.location.href = 'buyer-order-details.html?id=' + orderId;

            });

        });


    }

    $scope.buyerdelete = function () {

        //alert('hi');
        //console.log($scope.termsli);
        var buyercountryId = parseInt(window.localStorage.getItem('User_Location'));
        $http.get(baseurl + 'getcountry/' + buyercountryId).success(function (data, status) {
            // console.log(data);
            $scope.order.buyercountry = data.CountryTitle;
            $scope.order.buyername = window.localStorage.getItem('User_Name');
            $scope.order.buyeremail = window.localStorage.getItem('User_Email');
            var orderId = $scope.order.OrderId;
            var date = new Date();
            var messagedate = date.toLocaleDateString('en-GB', {
                timeZone: 'Asia/Singapore'
            });
            var messagetime = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Singapore'
            });
            dateToday = messagedate + ' ' + messagetime;
            $scope.data = {};
            $scope.data.terms = $scope.termslist;
            $scope.data.order = $scope.order;
            $scope.data.datetime = dateToday;
            $scope.data.date = messagedate;
            $scope.data.date = messagedate;

            //console.log($scope.data);
            $http.post(baseurl + 'buyerdelete/', $scope.data).success(function (data, status) {

                window.location.href = 'buyer-order-details.html?id=' + orderId;

            });

        });


    }

    $scope.getcurrency = function () {

        $scope.product = {};
        $scope.product.CountryId = parseInt(window.localStorage.getItem('User_Location'));
        $http.get(baseurl + 'getcurrency/' + $scope.product.CountryId).success(function (data, status) {

            // console.log(data);
            $scope.product.currency = data.CountryCurrency;

        });

    }

    $scope.getAllcurrency = function () {

        $http.get(baseurl + 'getAllcurrency/').success(function (data, status) {

            // console.log(data);

            $scope.currencylist = data;

        });

    }

    $scope.changeCurrency = function (product) {

        // console.log(product);
        $scope.product = product;
        $scope.currency = {};
        $scope.currency.amount = $scope.product.Price;
        $scope.currency.baseCurrency = $scope.product.Currency;
        $scope.currency.changeCurrency = $scope.product.changeCurrency;
        if ($scope.product.Currency != $scope.product.changeCurrency) {
            // $http.get('http://api.fixer.io/latest?base='+$scope.currencyIndex).then(function(res){

            //    console.log(res.data.rates);
            //    $scope.product.changePrice = parseFloat($scope.amount) * res.data.rates[$scope.product.changeCurrency];
            //  });
            $http.post(baseurl + 'changeCurrency/', $scope.currency).then(function (data, status) {
                // console.log(data.data.converted);
                $scope.product.changePrice = data.data.converted.toFixed(2);
                //$scope.product.changePrice = parseFloat($scope.amount) * res.data.rates[$scope.product.changeCurrency];
            });
        } else {
            $scope.product.changePrice = $scope.product.Price;
        }
    }

    $scope.convertCurrency = function (data) {

        // console.log(product);
        $scope.data = data;
        $scope.currency = {};
        $scope.currency.amount = $scope.data.amount;
        $scope.currency.baseCurrency = $scope.data.Currency;
        $scope.currency.changeCurrency = $scope.data.changeCurrency;
        // console.log($scope.currency.amount);
        if ($scope.currency.amount !== '') {
            if ($scope.data.Currency != $scope.data.changeCurrency) {
                // $http.get('http://api.fixer.io/latest?base='+$scope.currencyIndex).then(function(res){

                //    console.log(res.data.rates);
                //    $scope.product.changePrice = parseFloat($scope.amount) * res.data.rates[$scope.product.changeCurrency];
                //  });
                $http.post(baseurl + 'changeCurrency/', $scope.currency).then(function (data, status) {
                    // console.log(data.data.converted);
                    $scope.data.changePrice = data.data.converted.toFixed(2);
                    //$scope.product.changePrice = parseFloat($scope.amount) * res.data.rates[$scope.product.changeCurrency];
                });
            } else {
                $scope.data.changePrice = $scope.data.amount;
            }

        } else {
            $scope.data.changePrice = '';
        }

    }

    $scope.calculate = function (product, index) {

        //console.log(product.percentage[index]);
        $scope.product = product;
        if (typeof $scope.product.amount === 'undefined') {
            $scope.product.amount = {};

        }
        $scope.product.amount[index] = parseFloat($scope.product.Price * $scope.product.orderqty * $scope.product.percentage[index] / 100).toFixed(2);
        if ($scope.product.amount[index] == 0) {
            $scope.product.amount[index] = '';
        }
        // $scope.product.percentage[index] = '';
        // alert('hi');
    }




    $scope.cal = function (product, per) {

        //console.log(product.percentage[index]);
        $scope.product = product;
        $scope.per = per;
        $scope.amt = parseFloat($scope.product.Price * $scope.product.MinOrderQty * $scope.per / 100).toFixed(2);
        if ($scope.amt == 0) {
            $scope.amt = '';
        }
        if (typeof $scope.product.percentage !== 'undefined') {
            $.each($scope.product.percentage, function (key, value) {
                $scope.product.amount[key] = parseFloat($scope.product.Price * $scope.product.MinOrderQty * $scope.product.percentage[key] / 100).toFixed(2);

            });
        }

    }

    /*   $scope.cal1= function(product,per1){

     //console.log(product.percentage[index]);
     $scope.product = product;
     $scope.per1 = per1;
     $scope.amt1 = parseFloat($scope.product.Price * $scope.product.orderqty *  $scope.per1 / 100).toFixed(2);
     if ( $scope.amt1 == 0)
        {
           $scope.amt1 = '';
        }

       }
*/
    $scope.changeType = function () {

        $scope.types1 = $scope.types;
        if (typeof $scope.product.type !== 'undefined') {
            $.each($scope.product.type, function (key, value) {

                $scope.product.type[key] = $scope.types;

            });
        }
    }

    $scope.changeType1 = function () {

        $scope.types = $scope.types1;
        if (typeof $scope.product.type !== 'undefined') {
            $.each($scope.product.type, function (key, value) {

                $scope.product.type[key] = $scope.types1;

            });
        }
    }

    $scope.changeType2 = function (index) {


        if (typeof $scope.product !== 'undefined' && typeof $scope.product.type !== 'undefined') {
            $.each($scope.product.type, function (key, value) {

                $scope.product.type[key] = $scope.product.type[index];

            });

            $scope.types = $scope.product.type[index];
            $scope.types1 = $scope.product.type[index];
        }

        if (typeof $scope.termsli !== 'undefined') {
            $.each($scope.termsli, function (key, value) {

                $scope.termsli[key].Type = $scope.termsli[index].Type;

            });
        }
    }


    $scope.calterm = function (order, t) {
        $scope.t = t;
        $scope.t.Amount = parseFloat(order.TotalAmount * t.Percentage / 100).toFixed(2)

    }

    $scope.addterm = function (termsli) {
        //console.log($scope.termsli);
        if (typeof $scope.termsli !== 'undefined')
            var newterm = {
                TermsId: 0,
                Type: $scope.termsli[0].Type
            };
        else
            var newterm = {
                TermsId: 0,
                Type: 'Trade Exchange Escrow (TEE)'
            };
        $scope.termsli.push(newterm);
    }

    $scope.removeterm = function (index) {
        //console.log(t);
        $scope.termsli.splice(index, 1);
    }

    $scope.remove = function (product, index) {

        //console.log(product.percentage[index]);
        $scope.product = product;
        $("#termsdiv" + index).hide();
        if (typeof $scope.product.remove === 'undefined') {
            $scope.product.remove = {};

        }
        $scope.product.remove[index] = 1;

    }


    $scope.getvalues = function (product) {


        // $scope.term = {};
        // $scope.type = {};
        // $scope.percentage = {};
        // $scope.amount = {};
        $scope.term = "50% In Advance";
        $scope.type = "Trade Exchange Escrow (TEE)";
        $scope.percentage = 50;
        $scope.amount = parseFloat(product.Price * product.orderqty * $scope.percentage / 100).toFixed(2);


    }

    //    $scope.IsInWishlist = function (PId) {

    //     alert( $scope.ProductId);
    //     $scope.PId = PId;
    //     alert($scope.PId);
    //     $scope.added = 0
    //     var wishlist =JSON.parse(localStorage.getItem("wishlist"));
    //     for (i = 0; i < wishlist.length; i++) {
    //        alert(ProductId);
    //        if (wishlist[i]==ProductId)
    //        {
    //           $scope.added = 1;
    //        }
    //   }

    // }


    $scope.submitenquiry = function (enquiryform) {

        //console.log($scope.enquiry);

        var date = new Date();
        var messagedate = date.toLocaleDateString('en-GB', {
            timeZone: 'Asia/Singapore'
        });
        var messagetime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Singapore'
        });
        dateToday = messagedate + ' ' + messagetime;
        $scope.enquiry.date = dateToday;

        $http.post(baseurl + 'submitenquiry', $scope.enquiry).success(function (data, status) {

            if (data.status == true) {
                document.enquiryform.reset();
                $("#enquiryform").hide();
                $("#thankyou").show('slow');

            }

        });

    }

    $scope.postbid = function (enquiryform) {

        // console.log($scope.enquiry);

        var date = new Date();
        var messagedate = date.toLocaleDateString('en-GB', {
            timeZone: 'Asia/Singapore'
        });
        var messagetime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Singapore'
        });
        dateToday = messagedate + ' ' + messagetime;
        $scope.enquiry.date = messagedate;
        $scope.enquiry.datetime = dateToday;

        $http.post(baseurl + 'postbid', $scope.enquiry).success(function (data, status) {

            if (data.status == true) {

                $http.get(baseurl + 'getbiddings/' + $scope.enquiry.ProductId).success(function (data1, status1) {
                    $scope.biddinglist = data1;
                    document.enquiryform.reset();

                });

            }

        });

    }

    $scope.getunread = function (OtherUserId) {

        alert(OtherUserId);

    }

    $scope.conversation = function () {

        $scope.conversation = {};
        $scope.conversation.userid = window.localStorage.getItem('User_Id');
        $scope.conversation.OtherUserId = window.localStorage.getItem('Other_User_Id');
        $scope.conversation.ProductId = window.localStorage.getItem('Conversation_Product_Id');
        // console.log($scope.conversation);

        $http.post(baseurl + 'conversation/', $scope.conversation).success(function (data, status) {

            //console.log(status==true);
            $scope.conversation = data;

        });
        setTimeout(function () {

            //alert('hi');
            var wtf = $('.chat_area');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
        }, 1000);

    }

    $scope.conversationlist = function () {

        $scope.userid = window.localStorage.getItem('User_Id');

        $http.get(baseurl + 'conversationlist/' + $scope.userid).success(function (data, status) {


            // console.log(data);

            var url = window.location.href;
            var parts = url.split("?");
            if (parts.length > 1) {

                $scope.conversationlist = data;
                var urlparams = parts[1];
                var urlpart = urlparams.split('&');
                var id = urlpart[0].split('=');
                var productid = urlpart[1].split('=');
                //alert(id);
                window.localStorage.setItem('Other_User_Id', id[1]);
                window.localStorage.setItem('Conversation_Product_Id', productid[1]);
                $scope.ProductId = productid[1];

                $http.get(baseurl + 'getProductName/' + $scope.ProductId).success(function (data, status) {
                    // console.log(data);
                    $scope.ProductName = data.ProductName;

                });
                $scope.conversation();
            } else {
                $scope.conversationlist = data;
                window.localStorage.setItem('Other_User_Id', $scope.conversationlist[0].SupId);
                window.localStorage.setItem('Conversation_Product_Id', $scope.conversationlist[0].ProductId);
                $scope.ProductId = $scope.conversationlist[0].ProductId;

                $http.get(baseurl + 'getProductName/' + $scope.ProductId).success(function (data, status) {
                    // console.log(data);
                    $scope.ProductName = data.ProductName;
                    $scope.ProductType = data.ProductType;


                });
                //$scope.conversation();
                $scope.conversation();
            }

            // console.log($scope.OtherUserId);
        });

    }

    setInterval(function () {


        var url = window.location.href;
        var parts = url.split("?");
        var pageurl = parts[0].split("/");
        var filename = pageurl.pop();
        // console.log(filename);
        if (filename == 'dashboard.html') {
            $scope.userid = window.localStorage.getItem('User_Id');

            $http.get(baseurl + 'conversationlist/' + $scope.userid).success(function (data, status) {

                // console.log($scope.conversationlist);

                if (parts.length > 1) {

                    $scope.conversationlist = data;
                    var urlparams = parts[1];
                    var urlpart = urlparams.split('&');
                    var id = urlpart[0].split('=');
                    var productid = urlpart[1].split('=');
                    //alert(id);
                    window.localStorage.setItem('Other_User_Id', id[1]);
                    window.localStorage.setItem('Conversation_Product_Id', productid[1]);
                    $scope.conv = {};
                    $scope.conv.userid = window.localStorage.getItem('User_Id');
                    $scope.conv.OtherUserId = window.localStorage.getItem('Other_User_Id');
                    $scope.conv.ProductId = window.localStorage.getItem('Conversation_Product_Id');
                    window.localStorage.setItem('Conversation_Product_Id', $scope.conversationlist[0].ProductId);
                    // console.log($scope.conversation);

                    $http.post(baseurl + 'conversation/', $scope.conv).success(function (data, status) {

                        $scope.conversation = data;
                        // console.log($scope.conversation);
                    });

                } else {
                    $scope.conversationlist = data;
                    window.localStorage.setItem('Other_User_Id', $scope.conversationlist[0].SupId);
                    window.localStorage.setItem('Conversation_Product_Id', $scope.conversationlist[0].ProductId);
                    $scope.conv = {};
                    $scope.conv.userid = window.localStorage.getItem('User_Id');
                    $scope.conv.OtherUserId = window.localStorage.getItem('Other_User_Id');
                    $scope.conv.ProductId = window.localStorage.getItem('Conversation_Product_Id');
                    // console.log($scope.conversation);

                    $http.post(baseurl + 'conversation/', $scope.conv).success(function (data, status) {

                        $scope.conversation = data;
                        // console.log($scope.conversation);

                    });
                }

                // console.log($scope.OtherUserId);
            });
        }

    }, 10000)


    $scope.sendmessage = function (message) {

        var date = new Date();
        var messagedate = date.toLocaleDateString('en-GB', {
            timeZone: 'Asia/Singapore'
        });
        var messagetime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Singapore'
        });
        dateToday = messagedate + ' ' + messagetime;
        //console.log(dateToday);


        $scope.message.userid = window.localStorage.getItem('User_Id');
        $scope.message.OtherUserId = window.localStorage.getItem('Other_User_Id');
        $scope.message.ProductId = window.localStorage.getItem('Conversation_Product_Id');
        $scope.message.date = dateToday;
        // console.log($scope.conversation);

        $http.post(baseurl + 'sendmessage/', $scope.message).success(function (data, status) {

            document.sendmsg.reset();
            //  var username = window.localStorage.getItem('User_Name');
            //  var content = "<li class='left clearfix'><span class='chat-img1 pull-left'><img src='uploads/ProfilePic/no-img.jpg' alt='User Avatar' class='img-circle'></span><div class='chat-body1 clearfix'><h6>"+username+"</h6><p>"+$scope.message.message+"</p><div class='chat_time pull-right'>"+data.date+"</div></div></li>";
            //  $('#chat_area').append(content);
            // var wtf    = $('.chat_area');
            // var height = wtf[0].scrollHeight;
            // wtf.scrollTop(height);

            $scope.conv = {};
            $scope.conv.userid = window.localStorage.getItem('User_Id');
            $scope.conv.OtherUserId = window.localStorage.getItem('Other_User_Id');
            $scope.conv.ProductId = window.localStorage.getItem('Conversation_Product_Id');

            // console.log($scope.conversation);

            $http.post(baseurl + 'conversation/', $scope.conv).success(function (data, status) {

                $scope.conversation = data;
                // console.log($scope.conversation);
                setTimeout(function () {
                    var wtf = $('.chat_area');
                    var height = wtf[0].scrollHeight;
                    wtf.scrollTop(height);
                }, 100);
            });
        });

    }

    $scope.sendchat = function (message) {

        var date = new Date();
        var messagedate = date.toLocaleDateString('en-GB', {
            timeZone: 'Asia/Singapore'
        });
        var messagetime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Singapore'
        });
        dateToday = messagedate + ' ' + messagetime;
        //console.log(dateToday);


        $scope.message.date = dateToday;
        // console.log($scope.conversation);

        $http.post(baseurl + 'sendmessage/', $scope.message).success(function (data, status) {

            document.sendmsg.reset();
            $(".message").hide();
            $(".message1").show();
            $("#modalclose").delay(1200).modal('hide');

        });

    }


    $scope.order = function (enquiryform) {


        // console.log($scope.product);

        // if($scope.product.paymenttype=="Bank Transfer"){
        //             //console.log($scope.data.paymenttype);

        //             $scope.product.total = $scope.product.orderqty*$scope.product.Price;

        //             $http.post(baseurl + 'addbankorder/',$scope.product).success(function(res) {

        //                  $("#orderform").hide();
        //                  $("#payform").hide();
        //                  $("#thankyou").show("slow");


        //             }).error(function() {
        //                   // alert("Please check your internet connection or data source..");
        //             });

        //           }else {
        //               $("#orderform").hide();
        //               $("#payform").show("slow");
        //               $("#thankyou").hide();
        //             }

        var date = new Date();
        var messagedate = date.toLocaleDateString('en-GB', {
            timeZone: 'Asia/Singapore'
        });
        var messagetime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Singapore'
        });
        dateToday = messagedate + ' ' + messagetime;
        $scope.product.datetime = dateToday;
        $scope.product.date = messagedate;
        if (typeof $scope.product.term === 'undefined') {
            $scope.product.term = {};
        }
        if (typeof $scope.product.type === 'undefined') {
            $scope.product.type = {};
        }
        if (typeof $scope.product.percentage === 'undefined') {
            $scope.product.percentage = {};
        }
        if (typeof $scope.product.amount === 'undefined') {
            $scope.product.amount = {};
        }
        if (typeof $scope.product.remove === 'undefined') {
            $scope.product.remove = {};
        }
        $scope.product.term[0] = $scope.terms;
        $scope.product.type[0] = $scope.types;
        $scope.product.percentage[0] = $scope.per;
        $scope.product.amount[0] = $scope.amt;
        $scope.product.remove[0] = 0;
        $scope.product.term[1] = $scope.terms1;
        $scope.product.type[1] = $scope.types1;
        $scope.product.percentage[1] = $scope.per1;
        $scope.product.amount[1] = $scope.amt1;
        $scope.product.remove[1] = 0;

        $scope.product.total = $scope.product.orderqty * $scope.product.Price;
        if (typeof $scope.product.term === 'undefined') {
            $scope.product.termsadded = 0;
        } else {
            $scope.product.termsadded = 1;
        }


        $scope.product.buyercountryId = parseInt(window.localStorage.getItem('User_Location'));
        $http.get(baseurl + 'getcountry/' + $scope.product.buyercountryId).success(function (data, status) {
            // console.log(data);
            $scope.product.buyercountry = data.CountryTitle;
            $("#pleacr-order-wrap").hide();
            $("#order-wrap").show("slow");
            console.log($scope.product);

        });


    }


    $scope.confirmorder = function () {

        $http.post(baseurl + 'placeorder/', $scope.product).success(function (res) {

            // $("#orderform").hide();
            // $("#payform").hide();
            // $("#thankyou").show("slow");
            window.location.href = 'index.html';

        }).error(function () {
            // alert("Please check your internet connection or data source..");
        });
    }

    $scope.stripeCallback = function (code, result) {


        //   console.log(code);


        if (result.error) {
            //window.alert('it failed! error: ' + result.error.message);
            $scope.paymessage = result.error.message;
            $scope.transactionid = result.id;

            console.log("Error");
            $("#orderform").hide();
            $("#payform").show();
            $("#thankyou").hide();

        } else {
            //$scope.data = {};
            //window.alert('success! token: ' + result.id);
            $scope.product.total = $scope.product.orderqty * $scope.product.Price;

            $scope.message = "Card Successfully Approved."
            $scope.product.stripeToken = result.id;
            $scope.paymessage = $scope.message;
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
            $http.post(baseurl + 'addorder/', $scope.product).success(function (res) {
                $scope.response = res;
                //  console.log(res);
                if (res.status == 'false') {
                    alert(res.message);
                } else {
                    alert(res.message);
                    //$location.path("/Cart");
                }
            }).error(function () {
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
            if (res.status == 'false') {}
        }).error(function () {
            console.log("error");
        })
        document.contactform.reset();
        $("#thankyou").show();
        $("#thankyou").delay(3200).hide(300);

        location.href = '/index.html';
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
        var packagename = package[1];
        $scope.packagename = packagename.replace(new RegExp('%20', 'g'), ' ');
        //$("#packageName").val($scope.packagename);
        //alert($scope.packagename);

    }
});