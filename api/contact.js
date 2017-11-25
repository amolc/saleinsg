var http = require('http');
var mysql = require('mysql');
var randomString = require('random-string');
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


exports.register = function(req, res){

  //console.log('req.body',req.body);

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
                            'Location':req.body.location,
                            'VerificationCode':verifycode,
                            'CreateDate':dateToday,
                            'PaymentStatus':'Pending',
                            'IsActive':1

                        }, function(err2, val2) {

                            if (!err2) 
                            {
                               // console.log(val2.insertId);
                                var regId = val2.insertId;
                               // console.log(req.body.Email);
                                var recipientEmail = req.body.Email; 
                                var subject = "[80STARTUPS.COM] saleinsg.com verification email";
                                var mailbody = '<table>\
                                                    <tr>\
                                                      <td><h1>Dear '+fullname+',</td>\
                                                    </tr>\
                                                    <tr>\
                                                    </tr>\
                                                    <tr>\
                                                      <td>Please click on the following link to verify your email account to complete registration process.</td>\
                                                    </tr>\
                                                    <tr>\
                                                      <td><a href="https://www.saleinsg.com/verify.html?id='+verifycode+'">Verification</a></td>\
                                                    </tr>\
                                                    <tr>\
                                                      <td>Best wishes,</td>\
                                                    </tr>\
                                                    <tr>\
                                                      <td><h2>saleinsg.com</h2></td>\
                                                    </tr>\
                                                    <tr>\
                                                      <td bgcolor="#000000"><font color ="white">This is a one-time email. Please do not reply to this email.</font></td>\
                                                    </tr>\
                                                  </table>';

                                send_mail(recipientEmail, subject, mailbody);
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

    console.log(req.params.id);
    var sql = "UPDATE `tbl_Suppliers` SET VerificationCode = '' WHERE VerificationCode = '"+req.params.id+"'";
    console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
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
