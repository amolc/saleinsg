var http = require('http');
var mysql = require('mysql');
var randomString = require('random-string');
var stripe = require("stripe")("sk_test_GWo9JO8BeSsKJoE3XKNHy0I7"); 
var moment = require("moment");
var verifycode = randomString();
var now = moment();
var db = mysql.createPool({
  database: 'saleinsg',
  user: 'root',
  password: '10gXWOqeaf',
  host: 'db.80startups.com',
});

var CRUD = require('mysql-crud');
var consultCRUD = CRUD(db, 'contact');
var userCRUD = CRUD(db, 'tbl_Suppliers');
var productCRUD = CRUD(db, 'tbl_Products');
var enquiryCRUD = CRUD(db, 'tbl_SuppliersEnquiries');
var orderCRUD = CRUD(db, 'tbl_Orders');

var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');
var transporter = nodemailer.createTransport({
  host: 'in-v3.mailjet.com',
  port: '587',
  auth: {
    user: '66ca4479851e0bd9cedc629bdff36ee6',
    pass: 'a3ec60f55a89f7fab98891e86818c8db'
  }
});

////-----------------CONTACT-----------------

exports.consult = function (req, res) {

  var fullName = req.body.fullname;
  var email = req.body.email;
  var phoneNumber = req.body.phonenumber;
  var travelDate = req.body.travelDate;
  var message = req.body.message;
  var packageName = req.body.packageName;
  var adults = req.body.adults;
  var Child = req.body.Child;
  var promoCode = req.body.promoCode;


  consultCRUD.create({
			'fullName': fullName,
      'email': email,
      'phonenumber': phoneNumber,
      'travelDate': travelDate,
      'packageName': packageName,
      'adults': adults,
      'Child': Child,
      'promoCode': promoCode,
      'message': message,
		},function (err,vals){

    })
     var recipientEmail = 'nadyshaikh@gmail.com,ceo@80startups.com,shital.talole@fountaintechies.com,pravinshelar999@gmail.com';
    //var recipientEmail = 'pravinshelar999@gmail.com'; //,ceo@80startups.com,shital.talole@fountaintechies.com'; //,ceo@80startups.com,shital.talole@80startups.com
    var subject = "[ambitiontours.COM] Ambition Tours Booking";
    var mailbody = '<table>\
                        <tr>\
                        <td><img src="https://ambitiontours.80startups.com/assets/img/logo.jpg"></td><br>\
                      </tr>\
                      <tr>\
                        <td><h1>Dear Ambition Tours,</td>\
                      </tr>\
                      <tr>\
                      </tr>\
                      <tr>\
                        <td>You have one enquiry from the following client:</td>\
                      </tr>\
                      <tr>\
                        <td>The details are as follow :<br><br><strong> Package Name:   ' + packageName + '</strong> <br><br><strong> Name:   ' + fullName + '</strong><br><br><strong> Email:   ' + email + '</strong><br><br><strong> Contact Number:   ' + phoneNumber + '</strong><br><br><strong> No of Adults:   ' + adults + '</strong><br><br><strong> No of Child:   ' + Child + '</strong><br><br><strong> Travel Date:   ' + travelDate + '</strong><br><br><strong>Message:   ' + message + '</strong><br><br><strong> Promo Code:   ' + promoCode + '</strong><br><br></td>\
                      </tr>\
                      <tr>\
                        <td>Best wishes,</td>\
                      </tr>\
                      <tr>\
                        <td><h2>ambitiontours.com</h2></td>\
                      </tr>\
                      <tr>\
                        <td bgcolor="#000000"><font color ="white">This is a one-time email. Please do not reply to this email.</font></td>\
                      </tr>\
                    </table>';

      send_mail(recipientEmail, subject, mailbody);
}

exports.allcountries = function (req, res) {
    var sql = "SELECT `CountryId`,`CountryTitle` FROM `tbl_Countries`";
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};

exports.allcategories = function (req, res) {
    var sql = "SELECT `CategoryId`,`CategoryTitle` FROM `tbl_Categories`";
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};

exports.getsubcategories = function (req, res) {
    var sql = "SELECT `SubCatId`,`SubCatTitle` FROM `tbl_SubCategories` WHERE `CategoryId` = "+req.params.id;
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};



exports.register = function(req, res){

  //console.log('req.body',req.body);


   verifycode = randomString();
   dateToday = now.format("YYYY-MM-DD H:mm:ss");
   var fullname =req.body.fname+" "+req.body.lname;



            userCRUD.load({
                Email: req.body.email
            },function (err3, val3) {

               // console.log(val3);

                if (val3.length<=0) 
                {
                    
                      if (req.body.password == req.body.cpassword) 
                        {

                          userCRUD.create({
                            'Email': req.body.email,
                            'Password': req.body.password,
                            'FirstName': req.body.fname,
                            'LastName': req.body.lname,
                            'Phone': req.body.phone,
                            'CompanyName':req.body.company,
                          //  'Location':req.body.location,
                            'CountryId' :req.body.CountryId,
                            'VerificationCode':'',
                            'CreateDate':dateToday,
                            'PaymentStatus':'Pending',
                            'IsActive':1

                        }, function(err2, val2) {

                            if (!err2) 
                            {
                               // console.log(val2.insertId);
                               //  var regId = val2.insertId;
                               // // console.log(req.body.Email);
                               //  var recipientEmail = req.body.Email; 
                               //  var subject = "[80STARTUPS.COM] saleinsg.com verification email";
                               //  var mailbody = '<table>\
                               //                      <tr>\
                               //                        <td><h1>Dear '+fullname+',</td>\
                               //                      </tr>\
                               //                      <tr>\
                               //                      </tr>\
                               //                      <tr>\
                               //                        <td>Please click on the following link to verify your email account to complete registration process.</td>\
                               //                      </tr>\
                               //                      <tr>\
                               //                        <td><a href="https://www.saleinsg.com/verify.html?id='+verifycode+'">Verification</a></td>\
                               //                      </tr>\
                               //                      <tr>\
                               //                        <td>Best wishes,</td>\
                               //                      </tr>\
                               //                      <tr>\
                               //                        <td><h2>saleinsg.com</h2></td>\
                               //                      </tr>\
                               //                      <tr>\
                               //                        <td bgcolor="#000000"><font color ="white">This is a one-time email. Please do not reply to this email.</font></td>\
                               //                      </tr>\
                               //                    </table>';

                               //  send_mail(recipientEmail, subject, mailbody);
                                var resdata = {
                                    status: true,
                                    value:val2,
                                    message: 'A verification link has been sent to your email account'
                                };

                                res.jsonp(resdata);
                            }
                            else
                            {
                                var resdata = {
                                    status: false,
                                    error: err2,
                                    message: 'Error: User not successfully added. '
                                };

                                res.jsonp(resdata);
                            }

                            });

                          }
                      
                        else
                        {

                            var resdata2 = {
                                status: false,
                                error: err3,
                                message: 'Both passwords should be same'
                            };

                            res.jsonp(resdata2);

                        }
                      

                }
                else
                {

                    var resdata3 = {
                        status: false,
                        error: err3,
                        message: 'Email id already exists'
                    };

                    res.jsonp(resdata3);

                }


            });

       
};


exports.verifyAccount = function(req, res){

    //console.log(req.params.id);
    var sql = "UPDATE `tbl_Suppliers` SET VerificationCode = '' WHERE VerificationCode = '"+req.params.id+"'";
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};


exports.login = function (req, res) {

    // console.log('req.body',req.body);

    var email = req.body.email;
    //var password = md5(req.body.password);
    var password = req.body.password;

    // console.log("Email :", email)
    // console.log("Password",password);

    userCRUD.load({
        Email: email
    }, function (err, val) {


        if (val.length > 0) 
        {

            userCRUD.load({
                Email: email,
                VerificationCode: ''
            },function (err3, val3) {

                if (val3.length > 0) 
                {

                   userCRUD.load({
                        Email: email,
                        Password: password,
                        VerificationCode: ''
                    },function (err2, val2) {

                        if (val2.length > 0) 
                        {

                            var resdata2 = {
                                passValid: true,
                                value:val2[0],
                                message: 'successfully login welcome to admin panel.'
                            };

                            res.jsonp(resdata2);

                        }
                        else
                        {

                            var resdata2 = {
                                passValid: false,
                                error: err2,
                                message: 'Password is incorrect!'
                            };

                            res.jsonp(resdata2);

                        }


                    });

                }
                else
                {

                    var resdata3 = {
                        verifyValid: false,
                        error: err3,
                        message: 'Please confirm your email!'
                    };

                    res.jsonp(resdata3);

                }


            });

        } 
        else 
        {
            var resdata = {
                emailexist: false,
                error: err,
                message: 'Email address does not exist!'
            };

            res.jsonp(resdata);
        }

       // res.jsonp(resdata);

    });
};


exports.addproduct = function (req, res) {

    // console.log(req.body.imagename)
    verifycode = randomString();

     if (req.body.image) {
         var imagedata = req.body.image;
         var matches = "";

         function decodeBase64Image(dataString) {
             var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
                 response = {};
             if (matches.length !== 3) {
                 return new Error('Invalid input string');
             }
             response.type = matches[1];
             response.data = new Buffer(matches[2], 'base64');
             return response;
         }
         var decodedImg = decodeBase64Image(imagedata);
         var imageBuffer = decodedImg.data;
         var type = decodedImg.type;
         fileName = verifycode+'_'+req.body.imagename;
         fs.writeFileSync('www/uploads/' + fileName, imageBuffer, 'utf8');
     }else {
         fileName = '';
         console.log("image not present");
     }
    
    //console.log(req.body.TypeId.TypeId);

    var createObj = {
        "ProductName" :  req.body.name,
        "Description": req.body.description || "",
        "Price":req.body.price || "",
        "Quantity": req.body.quantity || "",
        "Image1": fileName || "",
        "CountryId" : req.body.CountryId,
        "CategoryId" : req.body.CategoryId,
        "SubCatId" : req.body.SubCatId,
        // "Category": req.body.category || "",
        // "SubCategory": req.body.subcat || "",
        "SupplierId": req.body.UserId || "",      
    };
    // console.log("after", createObj);

    productCRUD.create(createObj, function (err, data) {

        if (!err) 
        {
            var resdata = {
                status: true,
                value:data.insertId,
                message: 'Details successfully added'
            };

            res.jsonp(resdata);
        }
        else
        {
            var resdata = {
                status: false,
                error: err,
                message: 'Error: Details not successfully added. '
            };

            res.jsonp(resdata);
        }
    });
};

exports.allproducts = function (req, res) {
    var sql = "SELECT * FROM `tbl_Products` ORDER BY `ProductId` DESC";
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};


exports.getproductsbylocation = function (req, res) {
  var location = req.params.id;
    var sql = "SELECT p.* FROM `tbl_Products` as p LEFT JOIN `tbl_Suppliers` as s ON p.`SupplierId` = s.`SupId` WHERE s.`Location` LIKE '%"+location+"%'  ORDER BY `ProductId` DESC";
   // console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};

exports.filterbycategory = function (req, res) {

    var id = req.params.id;
    var sql = "SELECT * FROM `tbl_Products` WHERE `CategoryId` = "+id+" ORDER BY `ProductId` DESC";
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};

exports.filterbycountry = function (req, res) {

    var id = req.params.id;
    var sql = "SELECT * FROM `tbl_Products` WHERE `CountryId` = "+id+" ORDER BY `ProductId` DESC";
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};

exports.getProductDetails = function (req, res) {

  var ProductId = req.params.id;
   var sql = "SELECT * FROM `tbl_Products` as p LEFT JOIN `tbl_Suppliers` as s ON p.`SupplierId` = s.`SupId` WHERE p.`ProductId`= "+ProductId;
   // console.log(sql);
  // console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data[0]);
    });
    
};


exports.submitenquiry = function (req, res) {

 // console.log(req.body);
  dateToday = now.format("YYYY-MM-DD H:mm:ss");
  enquiryCRUD.create({
                            'SupId': req.body.SupId,
                            'BuyerId': req.body.BuyerId,
                            'ProductId' : req.body.productId,
                            'Name': req.body.fullname,
                            'Email': req.body.email,
                            'PhoneNo': req.body.phonenumber,
                            'Enquiry':req.body.message,
                            'EnquiryDate':dateToday,

                        }, function(err2, val2) {

                            if (!err2) 
                            {
                               // console.log(val2.insertId);
                               //  var regId = val2.insertId;
                               // // console.log(req.body.SupEmail);
                               //  var recipientEmail = req.body.Email; 
                               //  var subject = "[80STARTUPS.COM] saleinsg.com verification email";
                               //  var mailbody = '<table>\
                               //                      <tr>\
                               //                        <td><h1>Dear '+req.body.SupName+',</td>\
                               //                      </tr>\
                               //                      <tr>\
                               //                      </tr>\
                               //                      <tr>\
                               //                        <td>You have new enquiry for your product.</td>\
                               //                      </tr>\
                               //                      <tr>\
                               //                        <td>Product Name : '+req.body.productname+'</td>\
                               //                      </tr>\
                               //                      <tr>\
                               //                        <td>Best wishes,</td>\
                               //                      </tr>\
                               //                      <tr>\
                               //                        <td><h2>saleinsg.com</h2></td>\
                               //                      </tr>\
                               //                      <tr>\
                               //                        <td bgcolor="#000000"><font color ="white">This is a one-time email. Please do not reply to this email.</font></td>\
                               //                      </tr>\
                               //                    </table>';

                               //  send_mail(recipientEmail, subject, mailbody);
                                var resdata = {
                                    status: true,
                                    value:val2,
                                    message: 'Enquiry submitted successfully'
                                };

                                res.jsonp(resdata);
                            }
                            else
                            {
                                var resdata = {
                                    status: false,
                                    error: err2,
                                    message: 'Enquiry not submitted'
                                };

                                res.jsonp(resdata);
                            }


               });
    
};

exports.addbankorder = function (req, res) {

  //console.log(req.body);
  dateToday = now.format("YYYY-MM-DD H:mm:ss");
  orderCRUD.create({
                            SuplierId:req.body.SupplierId,
                            ProductId:req.body.ProductId,
                            Quantity:req.body.orderqty,
                            Price:req.body.Price,
                            TotalAmount: req.body.total,
                            BuyerId: req.body.BuyerId,
                            OrderDate: dateToday,
                            ShippingAddress: req.body.address,
                            paymenttype:req.body.paymenttype,

                        }, function(err2, val2) {

                            if (!err2) 
                            {
                            var orderID = val2.insertId ;
                            var agentemail = "ceo@80startups.com";
                            var officeremail = "shital.talole@fountaintechies.com";
                            var subject = "New Order - "+orderID;
                            var mailbody = "Hello,</br><p>New Order  : </p>"


                             + "<p></br><p><b> Name: </b> " + req.body.fullname + "</p>"
                             + "</br><p><b> Email:</b> " + req.body.email + "</p>"
                             + "</br><p><b> Phone: </b> " + req.body.phonenumber + "</p>"
                             + "</br><p><b> Address :</b> " + req.body.address + "</p>"
                             + "</br><p><b> Product :</b> " + req.body.ProductName + "</p>"
                             + "</br><p><b> Qty :</b> " + req.body.orderqty + "</p>"
                             + "</br><p><b> Product Price:</b> " + req.body.Price + "</p>"
                             + "</br><p><b> Total Price:</b> SGD " + req.body.total + "</p>"
                             + "</br><p><b> Payment Type:</b> " +  req.body.paymenttype + "</p>"

                             + "<p></br><p><b></p>"

                             + "Thanks, tradeexchange";

                             send_mail( agentemail, subject, mailbody );
                             send_mail( officeremail, subject, mailbody );
                             send_mail( req.body.Email, subject, mailbody );
                                var resdata = {
                                    status: true,
                                    value:val2,
                                    message: 'Order Placed successfully'
                                };

                                res.jsonp(resdata);
                            }
                            else
                            {
                                var resdata = {
                                    status: false,
                                    error: err2,
                                    message: 'Order Not Placed'
                                };

                                res.jsonp(resdata);
                            }


               });
    
};

exports.addorder = function(req, res){
        //console.log(req.body);
        var token = req.body.stripeToken;
        var amount = req.body.total ;
        var stripeToken = "" ;
        amount = amount*100 ;
        dateToday = now.format("YYYY-MM-DD H:mm:ss");
        // Charge the user's card:
        var charge = stripe.charges.create({
          amount: amount,
          currency: "sgd",
          description: req.body.ProductName,
          source: token
        }, function(err, charge) {
          // asynchronously called
        //  console.log('err',err);
            if(!err){
              //  console.log('charge',charge);
                stripetoken = charge.id ;
                orderCRUD.create({
                  SuplierId:req.body.SupplierId,
                            ProductId:req.body.ProductId,
                            Quantity:req.body.orderqty,
                            Price:req.body.Price,
                            TotalAmount: req.body.total,
                            BuyerId: req.body.BuyerId,
                            OrderDate: dateToday,
                            ShippingAddress: req.body.address,
                            paymenttype:req.body.paymenttype,
                            stripeToken: stripetoken,
                 }, function (err, vals) {
                  //mysql callback
                        if(err){
                          //console.log(err);
                        }else{

                            console.log('return',vals.insertId) ;

                            var orderID = vals.insertId ;
                            var agentemail = "ceo@80startups.com";
                            var officeremail = "shital.talole@fountaintechies.com";
                            var subject = "New Order - "+orderID;
                            var mailbody = "Hello,</br><p>New Order  : </p>"


                             + "<p></br><p><b> Name: </b> " + req.body.fullname + "</p>"
                             + "</br><p><b> Email:</b> " + req.body.email + "</p>"
                             + "</br><p><b> Phone: </b> " + req.body.phonenumber + "</p>"
                             + "</br><p><b> Address :</b> " + req.body.address + "</p>"
                             + "</br><p><b> Product :</b> " + req.body.ProductName + "</p>"
                             + "</br><p><b> Qty :</b> " + req.body.orderqty + "</p>"
                             + "</br><p><b> Product Price:</b> " + req.body.Price + "</p>"
                             + "</br><p><b> Total Price:</b> SGD " + req.body.total + "</p>"
                             + "</br><p><b> Payment Type:</b> " +  req.body.paymenttype + "</p>"

                             + "<p></br><p><b></p>"
                             + "</br><p><b> Token:</b> " + stripetoken + "</p>"
                             + "Thanks, tradeexchange";

                             send_mail( agentemail, subject, mailbody );
                             send_mail( officeremail, subject, mailbody );
                             send_mail( req.body.Email, subject, mailbody );
                             //mail to ordering customer
                             //send_mail( data.orderemail, subject, mailbody );

                        }

                  });
            }else{
                  console.log('err',err);
                }

        });

};

///____________________END______________________

function send_mail(usermail, subject, mailbody) {

  var auth = {
    auth: {
      api_key: 'key-b4687b67307cb2598abad76006bd7a4a',
      domain: '80startups.com'
    }
  }

  var nodemailerMailgun = nodemailer.createTransport(mg(auth));

  nodemailerMailgun.sendMail({
    from: 'operations@80startups.com',
    to: usermail, // An array if you have multiple recipients.
    subject: subject,
    'h:Reply-To': 'operations@80startups.com',
    //You can use "html:" to send HTML email content. It's magic!
    html: mailbody,
    //You can use "text:" to send plain-text content. It's oldschool!
    text: mailbody
  }, function(err, info) {
    if (err) {
      console.log('Error: ' + err);
    } else {
      console.log('Response: ' + info);
      //res.sendStatus(200);

    }
  });
};
