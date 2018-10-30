var http = require('http');
var mysql = require('mysql');
var randomString = require('random-string');
//var stripe = require("stripe")("sk_test_GWo9JO8BeSsKJoE3XKNHy0I7");
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
var messagesCRUD = CRUD(db, 'tbl_Messages');
var productSpecificationCRUD=CRUD(db,'tbl_ProductSpecification');
const converter = require('google-currency');


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
    var sql = "SELECT `CountryId`,`CountryTitle`,`CountryFlag` FROM `tbl_Countries`";
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};

exports.changeCurrency = function (req, res) {
    const options = {
        from: req.body.baseCurrency,
        to: req.body.changeCurrency,
        amount: req.body.amount
      }
      converter(options).then(value => {
        //console.log(value[0])
        res.json(value); // Return object
      })
};

exports.allcategories = function (req, res) {
    var sql = "SELECT `CategoryId`,`CategoryTitle` FROM `tbl_Categories`";
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};

exports.getsubcategories = function (req, res) {
    var catId=req.params.id;
    console.log('cat id to get sub categories', catId)
    var sql = "SELECT `SubCatId`,`SubCatTitle` FROM `tbl_SubCategories` WHERE `CategoryId` = "+catId;
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
        console.log(data);

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
                            'Location':req.body.location,
                            'CountryId' :req.body.CountryId,
                            'VerificationCode':'',
                            'CreateDate':req.body.datetime,
                            'PaymentStatus':'Pending',
                            'IsActive':1

                        }, function(err2, val2) {

                            if (!err2)
                            {
                               console.log(val2.insertId);
                                var regId = val2.insertId;
                               // console.log(req.body.Email);
                                var recipientEmail = req.body.email+',ceo@80startups.com,shital.talole@fountaintechies.com,office@80startups.com,magnusideas5@gmail.com';
                                var subject = "Tradeexchange.co - Registration confirmation mail";
                                // var mailbody = '<table>\
                                //                     <tr>\
                                //                       <td><h1>Dear '+fullname+',</td>\
                                //                     </tr>\
                                //                     <tr>\
                                //                     </tr>\
                                //                     <tr>\
                                //                       <td>Please click on the following link to verify your email account to complete registration process.</td>\
                                //                     </tr>\
                                //                     <tr>\
                                //                       <td><a href="https://www.saleinsg.com/verify.html?id='+verifycode+'">Verification</a></td>\
                                //                     </tr>\
                                //                     <tr>\
                                //                       <td>Best wishes,</td>\
                                //                     </tr>\
                                //                     <tr>\
                                //                       <td><h2>saleinsg.com</h2></td>\
                                //                     </tr>\
                                //                     <tr>\
                                //                       <td bgcolor="#000000"><font color ="white">This is a one-time email. Please do not reply to this email.</font></td>\
                                //                     </tr>\
                                //                   </table>';

                                 // var mailbody = '<table>\
                                 //                    <tr>\
                                 //                      <td><h1>Dear '+fullname+',</td>\
                                 //                    </tr>\
                                 //                    <tr>\
                                 //                    </tr>\
                                 //                    <tr>\
                                 //                      <td>You are successfully registered with tradeexchange.co</td>\
                                 //                    </tr>\
                                 //                    <tr>\
                                 //                      <td>Best wishes,</td>\
                                 //                    </tr>\
                                 //                    <tr>\
                                 //                      <td><h2>tradeexchange.co</h2></td>\
                                 //                    </tr>\
                                 //                    <tr>\
                                 //                      <td bgcolor="#000000"><font color ="white">This is a one-time email. Please do not reply to this email.</font></td>\
                                 //                    </tr>\
                                 //                  </table>';


                               var mailbody = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head>\
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\
<meta name="viewport" content="width=device-width">\
<meta http-equiv="X-UA-Compatible" content="IE=edge">\
<title>Empty Template</title>\
<link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css">\
<style type="text/css" id="media-query">\
body {margin: 0;padding: 0; }\
table, tr, td {vertical-align: top;border-collapse: collapse; }\
.ie-browser table, .mso-container table {table-layout: fixed; }* {line-height: inherit; }\
a[x-apple-data-detectors=true] {color: inherit !important;text-decoration: none !important; }[owa] .img-container div, [owa] .img-container button {display: block !important; }[owa] .fullwidth button {width:100% !important; }\
[owa] .block-grid .col {display: table-cell;float: none !important;vertical-align: top; }\
.ie-browser .num12, .ie-browser .block-grid, [owa] .num12, [owa] .block-grid {width: 620px !important; }\
.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td,\
.ExternalClass div {line-height: 100%; }\
.ie-browser .mixed-two-up .num4, [owa] .mixed-two-up .num4 {width: 204px !important; }\
.ie-browser .mixed-two-up .num8, [owa] .mixed-two-up .num8 {width: 408px !important; }\
.ie-browser .block-grid.two-up .col, [owa] .block-grid.two-up .col {width: 310px !important; }\
.ie-browser .block-grid.three-up .col, [owa] .block-grid.three-up .col {width: 206px !important; }\
.ie-browser .block-grid.four-up .col, [owa] .block-grid.four-up .col {width: 155px !important; }\
.ie-browser .block-grid.five-up .col, [owa] .block-grid.five-up .col {width: 124px !important; }\
.ie-browser .block-grid.six-up .col, [owa] .block-grid.six-up .col {width: 103px !important; }\
.ie-browser .block-grid.seven-up .col, [owa] .block-grid.seven-up .col {width: 88px !important; }\
.ie-browser .block-grid.eight-up .col, [owa] .block-grid.eight-up .col {width: 77px !important; }\
.ie-browser .block-grid.nine-up .col, [owa] .block-grid.nine-up .col {width: 68px !important; }\
.ie-browser .block-grid.ten-up .col, [owa] .block-grid.ten-up .col {width: 62px !important; }\
.ie-browser .block-grid.eleven-up .col, [owa] .block-grid.eleven-up .col {width: 56px !important; }\
.ie-browser .block-grid.twelve-up .col, [owa] .block-grid.twelve-up .col {width: 51px !important; }\
@media only screen and (min-width: 640px) {.block-grid {width: 700px !important; }\
.block-grid .col {vertical-align: top; }\
.block-grid .col.num12 {width: 620px !important; }\
.block-grid.mixed-two-up .col.num4 {width: 204px !important; }\
.block-grid.mixed-two-up .col.num8 {width: 408px !important; }\
.block-grid.two-up .col {width: 310px !important; }\
.block-grid.three-up .col {width: 206px !important; }\
.block-grid.four-up .col {width: 155px !important; }\
.block-grid.five-up .col {width: 124px !important; }\
.block-grid.six-up .col {width: 103px !important; }\
.block-grid.seven-up .col {width: 88px !important; }\
.block-grid.eight-up .col {width: 77px !important; }\
.block-grid.nine-up .col {width: 68px !important; }\
.block-grid.ten-up .col {width: 62px !important; }\
.block-grid.eleven-up .col {width: 56px !important; }\
.block-grid.twelve-up .col {width: 51px !important; } }\
@media (max-width: 640px) {.block-grid, .col {min-width: 320px !important;max-width: 100% !important;display: block !important; }\
.block-grid {width: calc(100% - 40px) !important; }.col {width: 100% !important; }.col > div {margin: 0 auto; }img.fullwidth, img.fullwidthOnMobile {max-width: 100% !important; }\
.no-stack .col {min-width: 0 !important;display: table-cell !important; }\
.no-stack.two-up .col {width: 50% !important; }\
.no-stack.mixed-two-up .col.num4 {width: 33% !important; }.no-stack.mixed-two-up .col.num8 {width: 66% !important; }\
.no-stack.three-up .col.num4 {width: 33% !important; }\
.no-stack.four-up .col.num3 {width: 25% !important; } }\
</style></head>\
<body class="clean-body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #FFFFFF">\
<style type="text/css" id="media-query-bodytag">\
@media (max-width: 520px) {.block-grid {min-width: 320px!important;max-width: 100%!important;width: 100%!important;display: block!important;}\
.col {min-width: 320px!important;max-width: 100%!important;width: 100%!important;display: block!important;}\
.col > div {margin: 0 auto;}\
img.fullwidth {max-width: 100%!important;}\
img.fullwidthOnMobile {max-width: 100%!important;}\
.no-stack .col {min-width: 0!important;display: table-cell!important;}\
.no-stack.two-up .col {width: 50%!important;}\
.no-stack.mixed-two-up .col.num4 {width: 33%!important;}\
.no-stack.mixed-two-up .col.num8 {width: 66%!important;}\
.no-stack.three-up .col.num4 {width: 33%!important}\
.no-stack.four-up .col.num3 {width: 25%!important}}\
</style>\
<table class="nl-container" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px; border: 1px solid #52bad5; background-color: #FFFFFF;width: 700" cellpadding="0" cellspacing="0">\
<tbody>\
<tr style="vertical-align: top">\
<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">\
<div style="background-color:transparent;">\
<div style="Margin: 0 auto;min-width: 320px;max-width: 620px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid two-up ">\
<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">\
<div class="col num6" style="max-width: 320px;min-width: 310px;display: table-cell;vertical-align: top;">\
<div style="background-color: transparent; width: 100% !important;">\
<div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 10px; padding-left: 10px;">\
<div align="left" class="img-container left fixedwidth" style="padding-right: 0px;  padding-left: 0px;">\
<div style="line-height:10px;font-size:1px">&#160;</div>  <img class="left fixedwidth" align="left" border="0" src="https://www.tradeexchange.co/assets/img/logo.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: 0;height: auto;float: none;width: 100%;max-width: 174px" width="174">\
</div></div></div>\
<div class="col num6" style="max-width: 320px;min-width: 310px;display: table-cell;vertical-align: top;">\
<div style="background-color: transparent; width: 100% !important;">\
<div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 10px; padding-left: 10px;">\
<div style="font-family:Arial, \'Helvetica Neue\', Helvetica, sans-serif;line-height:120%;color:#555555; padding-right: 0px; padding-left: 0px; padding-top: 15px; padding-bottom: 15px;">\
<div style="font-size:12px;line-height:14px;font-family:Arial, \'Helvetica Neue\', Helvetica, sans-serif;color:#555555;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 14px;text-align: right"><span style="font-size: 14px; line-height: 16px;"><strong>'+req.body.date+'</strong></span></p></div></div>\
</div></div></div></div></div></div>\
<div style="background-color:transparent;">\
<div style="Margin: 0 auto;min-width: 320px;max-width: 620px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">\
<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">\
<div class="col num12" style="min-width: 320px;max-width: 620px;display: table-cell;vertical-align: top;">\
<div style="background-color: transparent; width: 100% !important;">\
<div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">\
<div style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 15px;">\
<div align="center"><div style="border-top: 1px solid #222222; width:100%; line-height:1px; height:1px; font-size:1px;">&#160;</div></div>\
</div>\
</div>\
</div>\
</div>\
</div>\
</div>\
</div>\
<div style="background-color:transparent;">\
<div style="Margin: 0 auto;min-width: 320px;max-width: 620px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">\
<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">\
<div class="col num12" style="min-width: 320px;max-width: 620px;display: table-cell;vertical-align: top;">\
<div style="background-color: transparent; width: 100% !important;">\
<div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 5px; padding-left: 5px;">\
<div style="font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif;line-height:120%;color:#52BAD5; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 5px;">\
<div style="font-size:12px;line-height:14px;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;color:#52BAD5;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><span style="font-size: 20px; line-height: 24px;"><strong><span style="line-height: 24px; font-size: 20px;">Registration</span></strong></span></p><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"></p></div></div></div></div></div></div></div></div>    <div style="background-color:transparent;">\
<div style="Margin: 0 auto;min-width: 320px;max-width: 620px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid two-up ">\
<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">\
<div class="col num12" style="max-width: 320px;min-width: 310px;display: table-cell;vertical-align: top;">\
<div style="background-color: transparent; width: 100% !important;">\
<div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">\
<div style="color:#000000;line-height:120%;font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">\
<div style="font-size:12px;line-height:14px;color:#000000;font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif;text-align:left;">\
<p style="margin: 0;font-size: 14px;line-height: 25px"><span style="font-size: 14px; line-height: 16px;">Dear, <br>'+req.body.fname+' '+req.body.lname+'</span></p></div> </div></div></div></div></div></div>\
<div style="background-color:transparent;">\
<div style="Margin: 0 auto;min-width: 320px;max-width: 620px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">\
<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">\
<div class="col num12" style="min-width: 320px;max-width: 620px;display: table-cell;vertical-align: top;">\
<div style="background-color: transparent; width: 100% !important;">\
<div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:10px; padding-right: 0px; padding-left: 0px;">\
<div style="font-size: 16px;font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif; text-align: center; width:100%;">\
<p style="color: #000000; font-size: 14px; line-height: 24px;font-family: \'Lato\', Tahoma, Verdana, Segoe, sans-serif; text-align: left; padding: 0px 10px;">Thank you for registering with TradeExchange, We proud to have you as a member of the <a style="text-decoration: none; color: #52BAD5;" href="https://www.tradeexchange.co/" target="_blank">TradeExchange</a> family. <br> Please <a  style="text-decoration: none; color: #52BAD5;" href="https://www.tradeexchange.co/login.html" target="_blank">login</a> to your account with below user name and password.</p>\
<p style="color: #000000; font-size: 14px; line-height: 20px;font-family: \'Lato\', Tahoma, Verdana, Segoe, sans-serif; text-align: left; padding: 0px 10px;"><b style="color:#52BAD5;">User Name : </b>'+req.body.email+'<br>\
<b style="color:#52BAD5;">Password :</b>'+req.body.password+'</p>\
<p  style="color: #000000; font-size: 14px; line-height: 24px;font-family: \'Lato\', Tahoma, Verdana, Segoe, sans-serif; text-align: left; padding: 0px 10px;"  >For any queries and details please feel free to contact us at support@tradeexchange.co We will be glad to hear from you. </p>\
<p  style="color: #000000; font-size: 14px; line-height: 24px;font-family: \'Lato\', Tahoma, Verdana, Segoe, sans-serif; text-align: right; padding: 0px 20px;"  ><b>Regards,</b><br> Team <a href="https://www.tradeexchange.co/index.html" target="_blank" style="text-decoration: none; color: #52BAD5;">WWW.TradeExchange.co</a></p>\
</div>\
</div>\
</div>\
<div style="background-color: #52bbd5; color: #ffffff; padding: 10px 10px 2px;">\
<span style="width:50%; text-align: left; display: inline-block; float: left; line-height: 30px;">\
<a href="tradeexchange.co" style="color: #ffffff; text-decoration: none; font-family: \'Lato\', Tahoma, Verdana, Segoe, sans-serif;">tradeexchange.co</a>\
</span>\
<span style="width:50%; text-align: right; display: inline-block;">\
<a href="https://www.facebook.com/tradeexchange.co" title="Facebook" target="_blank">\
<img src="https://www.tradeexchange.co/assets/img/facebook@2x.png" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto; max-width: 32px !important"></a>\
</span>\
</div>\
</div>\
</div>\
</div>\
</div>\
</td>\
</tr>\
</tbody>\
</table>\
</body></html>';

                                send_mail(recipientEmail, subject, mailbody);
                                var resdata = {
                                    status: true,
                                    value:val2,
                                    message: 'A confirmation has been sent to your email account'
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


exports.updateprofile = function(req, res){

   //  console.log(req.body);

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
         fileName = req.body.User_Id+'_'+req.body.ProfilePic;
         fs.writeFileSync('www/uploads/ProfilePic/' + fileName, imageBuffer, 'utf8');
     }else {
         fileName = req.body.ProfilePic;
     }

     var updateObj = {

              'FirstName': req.body.FirstName,
              'LastName': req.body.LastName,
              'Phone': req.body.Phone,
              'CompanyName':req.body.CompanyName,
              'Location' : req.body.Location,
              'CountryId' :req.body.CountryId,
              'ProfilePic' : fileName

      };

    userCRUD.update({SupId: req.body.User_Id}, updateObj,function(err, val) {

        if (!err)
        {
            var sql = "UPDATE `tbl_Products` SET CountryId = "+req.body.CountryId+" WHERE SupplierId = '"+req.body.User_Id+"'";
            ////console.log(sql);
            db.query(sql, function (err1, data1) {

            });
            var resdata = {
                status: true,
                value:fileName,
                message: 'Details successfully updated'
            };

            res.jsonp(resdata);
        }
        else
        {
            var resdata = {
                status: false,
                error: err,
                message: 'Error: Details not successfully updated. '
            };

            res.jsonp(resdata);
        }

    });

};


exports.updatebankdetails = function(req, res){


     var updateObj = {

              'AccountName': req.body.AccountName,
              'AccountNo': req.body.AccountNo,
              'BankName': req.body.BankName,
              'IFSCcode':req.body.IFSCcode,

      };

    userCRUD.update({SupId: req.body.User_Id}, updateObj,function(err, val) {

        if (!err)
        {
            var resdata = {
                status: true,
                value:val,
                message: 'Details successfully updated'
            };

            res.jsonp(resdata);
        }
        else
        {
            var resdata = {
                status: false,
                error: err,
                message: 'Error: Details not successfully updated. '
            };

            res.jsonp(resdata);
        }

    });

};


exports.updatepassword = function(req, res){

     var updateObj = {

              'Password': req.body.npassword,

      };

    userCRUD.update({SupId: req.body.User_Id}, updateObj,function(err, val) {

        if (!err)
        {
            var resdata = {
                status: true,
                value:val,
                message: 'Details successfully updated'
            };

            res.jsonp(resdata);
        }
        else
        {
            var resdata = {
                status: false,
                error: err,
                message: 'Error: Details not successfully updated. '
            };

            res.jsonp(resdata);
        }

    });

};

exports.verifyAccount = function(req, res){
    //console.log(req.params.id);
    var sql = "UPDATE `tbl_Suppliers` SET VerificationCode = '' WHERE VerificationCode = '"+req.params.id+"'";
    ////console.log(sql);
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
                IsDeleted: '0'
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
                        message: 'Account Deactivated, Please Contact Admin!'
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



exports.userinfo = function (req, res) {
    var UserId = req.params.id;
    var sql = "select s.*,c.`CountryTitle` from `tbl_Suppliers` as s LEFT JOIN `tbl_Countries` as c ON c.`CountryId` = s.`CountryId` WHERE SupId = "+UserId;
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data[0]);
    });
};

exports.allproducts = function (req, res) {
    var sql = "SELECT p.`ProductId`,p.`ProductName`,p.`Description`,p.`Price`,p.`Currency`,p.`Image1`,s.`CompanyName`,ct.`CategoryTitle`,c.`CountryFlag` FROM `tbl_Products` as p LEFT JOIN `tbl_Suppliers` as s ON s.`SupId` = p.`SupplierId` LEFT JOIN `tbl_Countries` as c ON c.`CountryId` = p.`CountryId` LEFT JOIN `tbl_Categories` as ct ON ct.`CategoryId` = p.`CategoryId` WHERE p.ProductType='Product' AND p.IsDisabled = '0' AND s.`IsDeleted` = '0' GROUP BY p.`ProductId` ORDER BY p.`ProductId` DESC";
    // //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};

exports.productrequests = function (req, res) {
    //var sql = "SELECT p.`ProductId`,p.`ProductName`,p.`Price`,p.`Currency`,p.`Image1`,p.`BuyerId`,p.`Quantity`,c.`CountryTitle`,s.`FirstName`,s.`LastName`,s.`CompanyName` FROM `tbl_Products` as p LEFT JOIN `tbl_Suppliers` as s ON s.`SupId` = p.`BuyerId` LEFT JOIN `tbl_Countries` as c ON c.`CountryId` = p.`CountryId` LEFT JOIN `tbl_Categories` as ct ON ct.`CategoryId` = p.`CategoryId` WHERE p.ProductType='Request' AND p.IsDisabled = '0' GROUP BY p.`ProductId` ORDER BY p.`ProductId` DESC";
    var sql = "SELECT p.`ProductId`,p.`ProductName`,p.`ExpectedPrice`,p.`Price`,p.`Currency`,p.`Image1`,p.`BuyerId`,p.`Quantity`,c.`CountryTitle`,s.`FirstName`,s.`LastName`,s.`CompanyName`,COUNT(`BidId`) as count,p.`IsAwarded` FROM `tbl_Products` as p LEFT JOIN `tbl_Suppliers` as s ON s.`SupId` = p.`BuyerId` LEFT JOIN `tbl_Countries` as c ON c.`CountryId` = p.`CountryId` LEFT JOIN `tbl_Categories` as ct ON ct.`CategoryId` = p.`CategoryId` LEFT JOIN `tbl_BiddingRequest` as b ON p.`ProductId` = b.`ProductId` WHERE p.ProductType='Request' AND p.IsDisabled = '0' AND s.`IsDeleted` = '0' GROUP BY p.`ProductId` ORDER BY p.`ProductId` DESC";
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};

exports.buyerproductrequests = function (req, res) {
  var id = req.params.id;
    var sql = "SELECT p.`ProductId`,p.`ProductName`,p.`ExpectedPrice`,p.`Price`,p.`Currency`,p.`Image1`,p.`BuyerId`,p.`Quantity`,c.`CountryTitle`,s.`FirstName`,s.`LastName`,s.`CompanyName`,COUNT(`BidId`) as count,p.`IsAwarded` FROM `tbl_Products` as p LEFT JOIN `tbl_Suppliers` as s ON s.`SupId` = p.`BuyerId` LEFT JOIN `tbl_Countries` as c ON c.`CountryId` = p.`CountryId` LEFT JOIN `tbl_Categories` as ct ON ct.`CategoryId` = p.`CategoryId` LEFT JOIN `tbl_BiddingRequest` as b ON p.`ProductId` = b.`ProductId` WHERE p.ProductType='Request' AND p.`BuyerId` = "+id+" AND p.IsDisabled = '0' GROUP BY p.`ProductId` ORDER BY p.`ProductId` DESC";
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};


exports.getproductsbylocation = function (req, res) {
  var location = req.params.id;
  var sql = "SELECT p.* FROM `tbl_Products` as p LEFT JOIN `tbl_Suppliers` as s ON p.`SupplierId` = s.`SupId`  WHERE p.ProductType='Product' AND s.`Location` LIKE '%"+location+"%'  ORDER BY `ProductId` DESC";
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};

exports.getrecentprod = function (req, res) {
  //  console.log("product ids "+req.body.recentProducts);
  var sql = "SELECT p.`ProductId`,p.`ProductName`,p.`Description`,p.`Price`,p.`Currency`,p.`Image1`,s.`CompanyName`,ct.`CategoryTitle`,c.`CountryFlag` FROM `tbl_Products` as p LEFT JOIN `tbl_Suppliers` as s ON s.`SupId` = p.`SupplierId` LEFT JOIN `tbl_Countries` as c ON c.`CountryId` = p.`CountryId` LEFT JOIN `tbl_Categories` as ct ON ct.`CategoryId` = p.`CategoryId` WHERE p.ProductType='Product' AND p.`ProductId` IN ("+req.body.recentProducts+") AND p.IsDisabled = '0' AND s.`IsDeleted` = '0' GROUP BY p.`ProductId` ORDER BY p.`ProductId` DESC";
  //console.log(sql);
    db.query(sql, function (err, data) {
        res.jsonp(data);
       // console.log(data);
    });
};

exports.filterbycategory = function (req, res) {
    var id = req.params.id;
    var sql = "SELECT p.`ProductId`,p.`ProductName`,p.`Description`,p.`Price`,p.`Currency`,p.`Image1`,s.`CompanyName`,ct.`CategoryTitle`,c.`CountryFlag` FROM `tbl_Products` as p LEFT JOIN `tbl_Suppliers` as s ON s.`SupId` = p.`SupplierId` LEFT JOIN `tbl_Countries` as c ON c.`CountryId` = p.`CountryId` LEFT JOIN `tbl_Categories` as ct ON ct.`CategoryId` = p.`CategoryId` WHERE p.ProductType='Product' AND p.`CategoryId` = "+id+" AND p.IsDisabled = '0' AND s.`IsDeleted` = '0' GROUP BY p.`ProductId` ORDER BY p.`ProductId` DESC";
    ////console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};

exports.filterbycountry = function (req, res) {
    var id = req.params.id;
    var sql = "SELECT p.`ProductId`,p.`ProductName`,p.`Description`,p.`Price`,p.`Currency`,p.`Image1`,s.`CompanyName`,ct.`CategoryTitle`,c.`CountryFlag` FROM `tbl_Products` as p LEFT JOIN `tbl_Suppliers` as s ON s.`SupId` = p.`SupplierId` LEFT JOIN `tbl_Countries` as c ON c.`CountryId` = p.`CountryId` LEFT JOIN `tbl_Categories` as ct ON ct.`CategoryId` = p.`CategoryId` WHERE p.ProductType='Product' AND p.`CountryId` = "+id+" AND p.IsDisabled = '0' AND s.`IsDeleted` = '0' GROUP BY p.`ProductId` ORDER BY p.`ProductId` DESC";
   // //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};



// exports.filterbyseller=function(req,res){
//     var sellerName=req.params.sellerName;
//     productCRUD.load({'sellerName':sellerName},function(err,data){
//         if(err){
//             console.log(err);
//         }else{
//             res.json(data);
//         }
//     })
// }


// exports.filterbyCouCat/*/*/ = function (req, res) {
//     console.log('parameter with url to api for query the filter data',req.body);

//     var CountryId = req.body.CountryId;
//     var CategoryId = req.body.CategoryId;
//     var sql = "SELECT p.`ProductId`,p.`ProductName`,p.`Description`,p.`Currency`,p.`Price`,p.`Image1`,s.`CompanyName`,ct.`CategoryTitle`,c.`CountryFlag` FROM `tbl_Products` as p LEFT JOIN `tbl_Suppliers` as s ON s.`SupId` = p.`SupplierId` LEFT JOIN `tbl_Countries` as c ON c.`CountryId` = p.`CountryId` LEFT JOIN `tbl_Categories` as ct ON ct.`CategoryId` = p.`CategoryId` WHERE p.ProductType='Product' AND p.`CategoryId` = "+CategoryId+" AND p.`CountryId` = "+CountryId+" AND p.IsDisabled = '0' AND s.`IsDeleted` = '0' GROUP BY p.`ProductId` ORDER BY p.`ProductId` DESC";
//     //console.log(sql);
//     db.query(sql, function (err, data) {
//         res.json(data);
//     });
// };



exports.filterbyCouCat = function (req, res) {
    console.log('parameter with url to api for query the filter data',req.body);

    var CountryId = req.params.CountryId;
    var CategoryId = req.params.CategoryId;
    var sql = "SELECT p.`ProductId`,p.`ProductName`,p.`Description`,p.`Currency`,p.`Price`,p.`Image1`,s.`CompanyName`,ct.`CategoryTitle`,c.`CountryFlag` FROM `tbl_Products` as p LEFT JOIN `tbl_Suppliers` as s ON s.`SupId` = p.`SupplierId` LEFT JOIN `tbl_Countries` as c ON c.`CountryId` = p.`CountryId` LEFT JOIN `tbl_Categories` as ct ON ct.`CategoryId` = p.`CategoryId` WHERE p.ProductType='Product' AND p.`CategoryId` = "+CategoryId+" AND p.`CountryId` = "+CountryId+" AND p.IsDisabled = '0' AND s.`IsDeleted` = '0' GROUP BY p.`ProductId` ORDER BY p.`ProductId` DESC";
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};



exports.filterbyCatSub = function (req, res) {
    var SubCatId = req.params.SubCatId;
    console.log('sub cat id ', SubCatId );
    var CategoryId = req.params.CategoryId;
    console.log('cat id is',CategoryId);
    var sql = "SELECT p.`ProductId`,p.`ProductName`,p.`Description`,p.`Price`,p.`Currency`,p.`Image1`,s.`CompanyName`,ct.`CategoryTitle`,c.`CountryFlag` FROM `tbl_Products` as p LEFT JOIN `tbl_Suppliers` as s ON s.`SupId` = p.`SupplierId` LEFT JOIN `tbl_Countries` as c ON c.`CountryId` = p.`CountryId` LEFT JOIN `tbl_Categories` as ct ON ct.`CategoryId` = p.`CategoryId` WHERE p.ProductType='Product' AND p.`CategoryId` = "+CategoryId+" AND p.`SubCatId` = "+SubCatId+" AND p.IsDisabled = '0' AND s.`IsDeleted` = '0' GROUP BY p.`ProductId` ORDER BY p.`ProductId` DESC";
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
        // console.log('filterbyCatSub data is :',data);
    });
};

exports.filterbySelCat = function (req, res) {
    console.log(req.body);

    var SellerId = req.params.SellerId;
    var CategoryId = req.params.CategoryId;
    var sql = "SELECT p.`ProductId`,p.`ProductName`,p.`Description`,p.`Currency`,p.`Price`,p.`Image1`,s.`CompanyName`,ct.`CategoryTitle`,c.`CountryFlag` FROM `tbl_Products` as p LEFT JOIN `tbl_Suppliers` as s ON s.`SupId` = p.`SupplierId` LEFT JOIN `tbl_Countries` as c ON c.`CountryId` = p.`CountryId` LEFT JOIN `tbl_Categories` as ct ON ct.`CategoryId` = p.`CategoryId` WHERE p.ProductType='Product' AND p.`CategoryId` = "+CategoryId+" AND p.`SupplierId` = "+SellerId+" AND p.IsDisabled = '0' AND s.`IsDeleted` = '0' GROUP BY p.`ProductId` ORDER BY p.`ProductId` DESC";
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};

exports.filterbyall = function (req, res) {

    var CountryId = req.params.CountryId;
    var CategoryId = req.params.CategoryId;
    var SubCatId = req.params.SubCatId;
    var sql = "SELECT p.`ProductId`,p.`ProductName`,p.`Description`,p.`Price`,p.`Currency`,p.`Image1`,s.`CompanyName`,ct.`CategoryTitle`,c.`CountryFlag` FROM `tbl_Products` as p LEFT JOIN `tbl_Suppliers` as s ON s.`SupId` = p.`SupplierId` LEFT JOIN `tbl_Countries` as c ON c.`CountryId` = p.`CountryId` LEFT JOIN `tbl_Categories` as ct ON ct.`CategoryId` = p.`CategoryId` WHERE p.ProductType='Product' AND p.`CategoryId` = "+CategoryId+" AND p.`CountryId` = "+CountryId+" AND p.`SubCatId` = "+SubCatId+" AND p.IsDisabled = '0' AND s.`IsDeleted` = '0' GROUP BY p.`ProductId` ORDER BY p.`ProductId` DESC";
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};

exports.filterallbyseller = function (req, res) {

    var SellerId = req.params.SellerId;
    var CategoryId = req.params.CategoryId;
    var SubCatId = req.params.SubCatId;
    var sql = "SELECT p.`ProductId`,p.`ProductName`,p.`Description`,p.`Price`,p.`Currency`,p.`Image1`,s.`CompanyName`,ct.`CategoryTitle`,c.`CountryFlag` FROM `tbl_Products` as p LEFT JOIN `tbl_Suppliers` as s ON s.`SupId` = p.`SupplierId` LEFT JOIN `tbl_Countries` as c ON c.`CountryId` = p.`CountryId` LEFT JOIN `tbl_Categories` as ct ON ct.`CategoryId` = p.`CategoryId` WHERE p.ProductType='Product' AND p.`CategoryId` = "+CategoryId+" AND p.`SupplierId` = "+SellerId+" AND p.`SubCatId` = "+SubCatId+" AND p.IsDisabled = '0' AND s.`IsDeleted` = '0' GROUP BY p.`ProductId` ORDER BY p.`ProductId` DESC";
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};






exports.getProductDetails = function (req, res) {

    var ProductId = req.params.id;
     var sql = "SELECT p.*,s.`CompanyName`,s.`Email` as SupEmail,s.`FirstName` as SupFirstName,s.`LastName` as SupLastName,ct.`CategoryTitle`,c.`CountryTitle`,sc.`SubCatTitle` FROM `tbl_Products` as p LEFT JOIN `tbl_Suppliers` as s ON p.`SupplierId` = s.`SupId` LEFT JOIN `tbl_Countries` as c ON c.`CountryId` = p.`CountryId` LEFT JOIN `tbl_Categories` as ct ON ct.`CategoryId` = p.`CategoryId` LEFT JOIN `tbl_SubCategories` as sc ON sc.`SubCatId`= p.`SubCatId` WHERE p.`ProductId`= "+ProductId;
    // //console.log(sql);
      db.query(sql, function (err, data) {
          res.json(data[0]);
        //  console.log('query data',data[0]);
      });
  };

exports.getReqProductDetails = function (req, res) {

  var ProductId = req.params.id;
   var sql = "SELECT p.*,s.`SupId`,s.`CompanyName`,s.`Email` as SupEmail,s.`FirstName` as SupFirstName,s.`LastName` as SupLastName,s.`Location` as SupLocation,c.`CountryTitle` FROM `tbl_Products` as p LEFT JOIN `tbl_Suppliers` as s ON p.`BuyerId` = s.`SupId` LEFT JOIN `tbl_Countries` as c ON c.`CountryId` = p.`CountryId` WHERE p.`ProductId`= "+ProductId;
   //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data[0]);
    });

};

exports.getbiddings = function (req, res) {

  var ProductId = req.params.id;
   var sql = "SELECT b.*,s.`SupId`,s.`CompanyName`,s.`Email` as SupEmail,s.`FirstName` as SupFirstName,s.`LastName` as SupLastName,s.`ProfilePic`,s.`Location`,c.`CountryTitle` FROM `tbl_BiddingRequest` as b LEFT JOIN `tbl_Suppliers` as s ON b.`SupplierId` = s.`SupId` LEFT JOIN `tbl_Countries` as c ON c.`CountryId` = s.`CountryId` WHERE b.`ProductId`= "+ProductId;
   //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });

};

exports.bidinfo = function (req, res) {

  var BidId = req.params.id;
   var sql = "SELECT b.*,s.`SupId`,s.`CompanyName`,s.`Email` as SupEmail,s.`FirstName` as SupFirstName,s.`LastName` as SupLastName,s.`ProfilePic`,s.`Location`,c.`CountryTitle` FROM `tbl_BiddingRequest` as b LEFT JOIN `tbl_Suppliers` as s ON b.`SupplierId` = s.`SupId` LEFT JOIN `tbl_Countries` as c ON c.`CountryId` = s.`CountryId` WHERE b.`BidId`= "+BidId;
   //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data[0]);
    });

};

// exports.getProductSpecification = function (req, res) {

//   var ProductId = req.params.id;
//    var sql = "SELECT `SpecificationId`,`Title`,`Description` FROM `tbl_ProductSpecification` WHERE `ProductId`= "+ProductId;
//    //console.log(sql);
//     db.query(sql, function (err, data) {
//         res.json(data);
//     });

// };

exports.getProductSpecification=function(req,res){
    var ProductId=req.params.id;
    productCRUD.load({'ProductId':ProductId},function(err,data){
        if(err){
            console.log(err);
        }else{
            // console.log('product details by p id', data);
            res.json(data);
        }
    })

}

exports.getSpecification=function(req,res){
    var ProductId=req.params.id;
    productSpecificationCRUD.load({'ProductId':ProductId},function(err,data){
        if(err){
            console.log(err);
        }else{
            // console.log('specification of Product by Product Id is:', data);
            res.json(data);
        }
    })
}

exports.getcurrency = function (req, res) {

  var CountryId = req.params.id;
   var sql = "SELECT `CountryCurrency` FROM `tbl_Countries` WHERE `CountryId`= "+CountryId;
   //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data[0]);
    });

};

exports.getcountry = function (req, res) {

  var CountryId = req.params.id;
   var sql = "SELECT `CountryTitle` FROM `tbl_Countries` WHERE `CountryId`= "+CountryId;
 // //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data[0]);
    });

};

exports.getProductName = function (req, res) {

  var ProductId = req.params.id;
   var sql = "SELECT `ProductName`,`ProductType` FROM `tbl_Products` WHERE `ProductId`= "+ProductId;
   ////console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data[0]);
    });

};

exports.getAllcurrency = function (req, res) {

   var sql = "SELECT `CountryCurrency` FROM `tbl_Currency`";
   //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });

};


exports.featuredseller = function (req, res) {

   var sql = "SELECT * FROM `tbl_Suppliers` as s LEFT JOIN `tbl_Products` as p ON s.`SupId` = p.`SupplierId` WHERE s.`IsDeleted` = '0' AND  (s.`ProfilePic` != 'NULL' OR s.`ProfilePic` != '') GROUP BY p.`SupplierId` ORDER BY p.`ProductId` DESC";
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });

};



exports.getsellerinfobyname=function(req,res){
    var companyName =req.params.companyName;
    console.log('company name is',companyName);
    userCRUD.load({'userName':companyName},function(err,data){
        if(err){
            console.log(err);
        }else{
          console.log(data);
            res.json(data);
        }
    })
}



// exports.getsellerinfo = function (req, res) {
//     console.log('in seller info api call');

//     var UserId = req.params.id;

//        var sql = "select s.`FirstName`,s.`LastName`,s.`CompanyName`,s.`Email`,s.`Phone`,s.`Location`,s.`ProfilePic`,c.`CountryTitle` from `tbl_Suppliers` as s LEFT JOIN `tbl_Countries` as c ON c.`CountryId` = s.`CountryId` WHERE SupId = "+UserId;

//       ////console.log(sql);
//       db.query(sql, function (err, data) {
//           res.json(data[0]);
//       });

//   };

  exports.getsellerinfo = function (req, res) {
    console.log('in seller info api call');

    var UserId = req.params.id;
    userCRUD.load({'SupId':UserId},function(err, data){
        if(err){
            console.log(err);
        }else{
            res.json(data);
        }

    })



  };

exports.filterbyseller = function (req, res) {
     var id=req.params.id;
    console.log('req is in fillter by seller api');
   // var sellerName = req.params.sellerName;
    //console.log(sellerName);
     var sql = "SELECT p.`ProductId`,p.`ProductName`,p.`Description`,p.`Price`,p.`Currency`,p.`Image1`,s.`CompanyName`,ct.`CategoryTitle`,c.`CountryFlag` FROM `tbl_Products` as p LEFT JOIN `tbl_Suppliers` as s ON s.`SupId` = p.`SupplierId` LEFT JOIN `tbl_Countries` as c ON c.`CountryId` = p.`CountryId` LEFT JOIN `tbl_Categories` as ct ON ct.`CategoryId` = p.`CategoryId` WHERE p.ProductType='Product' AND p.`SupplierId` = "+id+" AND p.IsDisabled = '0' AND s.`IsDeleted` = '0' GROUP BY p.`ProductId` ORDER BY p.`ProductId` DESC";

    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
        console.log('first query data is',data);
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
                         // ShippingAddress: req.body.address,
                            Address1: req.body.address1,
                            Address2: req.body.address2,
                            PostalCode: req.body.postalcode,
                            Country: req.body.country,
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
                             //   ShippingAddress: req.body.address,
                            Address1: req.body.address1,
                            Address2: req.body.address2,
                            PostalCode: req.body.postalcode,
                            Country: req.body.country,
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
    from: 'support@tradeexchange.co',
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
