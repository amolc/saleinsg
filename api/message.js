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
var bidCRUD = CRUD(db, 'tbl_BiddingRequest');

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


exports.submitenquiry = function (req, res) {

  // console.log(req.body);
  // dateToday = now.format("YYYY-MM-DD H:mm:ss");
  if (req.body.Type == 'Product') 
  {
        var sender = req.body.BuyerId;
        var receiver = req.body.SupId;
  }
  else
  {
        var sender = req.body.SupId;
        var receiver = req.body.BuyerId;
  }
  dateToday = now.format("DD/MM/YYYY hh:mm a");
  enquiryCRUD.create({
                            'SupId': req.body.SupId,
                            'BuyerId': req.body.BuyerId,
                            'ProductId' : req.body.productId,
                            'Name': req.body.fullname,
                            'Email': req.body.email,
                            'PhoneNo': req.body.phonenumber,
                            'Enquiry':req.body.message,
                            'EnquiryDate':dateToday,
                            'Type' : req.body.Type

                        }, function(err2, val2) {

                            if (!err2) 
                            { 
                              var createObj = {
                                "SenderId" :  sender,
                                "ReceiverId": receiver,
                                "ProductId" : req.body.productId,
                                "Type" : req.body.Type,
                                "Message":req.body.message,
                                "MessageTime": req.body.date, 
                                "EnquiryId" : val2.insertId     
                            };
                            // console.log("after", createObj);

                            messagesCRUD.create(createObj, function (err, data) {

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


exports.sendmessage = function (req, res) {

    dateToday = now.format("DD/MM/YYYY hh:mm a");
    

    var createObj = {
                                "SenderId" :  req.body.userid,
                                "ReceiverId": req.body.OtherUserId || "",
                                "ProductId" : req.body.ProductId,
                                "Message":req.body.message,
                                "MessageTime": req.body.date || "",      
                            };
                            // console.log("after", createObj);

                            messagesCRUD.create(createObj, function (err, data) {

                                if (!err) 
                                {
                                    var resdata = {
                                        status: true,
                                        value:data.insertId,
                                        message: 'Details successfully added',
                                        date : dateToday
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

exports.conversationlist = function (req, res) {
    var UserId = req.params.id;
    var sql = "select Max(m.MessageId) as Mid,concat(s.`SupId`,p.`ProductId`) as Pid,s.`ProfilePic`,s.`FirstName`,s.`LastName`,s.`SupId`,p.`ProductId`,p.`ProductName`,p.`ProductType` from `tbl_Messages` as m , `tbl_Suppliers` as s , `tbl_Products` as p WHERE (m.`ReceiverId` = s.`SupId` OR m.`SenderId` = s.`SupId`) AND (m.SenderId = "+UserId+" OR m.ReceiverId = "+UserId+") AND m.ProductId = p.ProductId AND s.SupId != "+UserId+" GROUP BY Pid ORDER By Mid DESC";
    console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};

exports.conversation = function (req, res) {
    var UserId = req.body.userid;
    var OtherUserId = req.body.OtherUserId;
    var ProductId = req.body.ProductId;
    var sql = "select m.MessageId as Mid,m.Message,m.MessageTime,s.`ProfilePic`,s.`FirstName`,s.`LastName` from `tbl_Messages` as m , `tbl_Suppliers` as s WHERE ((m.SenderId = "+UserId+" AND m.ReceiverId="+OtherUserId+") OR(m.SenderId = "+OtherUserId+" AND m.ReceiverId="+UserId+")) AND m.SenderId = s.SupId AND m.ProductId = "+ProductId+" GROUP BY Mid ORDER By Mid";
   console.log(sql);
    db.query(sql, function (err, data) {

        //console.log(data.length);
        var mid = '';
        var q = '';
         for (i = 0; i < data.length; i++) { 
            mid += q+data[i].Mid;
            q=',';
        }
        //console.log(mid);
        var sql = "UPDATE `tbl_Messages` SET IsRead = '1' WHERE MessageId IN ("+mid+") AND IsRead = '0' AND ReceiverId = "+UserId;
        //console.log(sql);
        db.query(sql, function (err1, data1) {
         res.json(data);
      });
    });
};

exports.postbid = function (req, res) {

    dateToday = now.format("DD/MM/YYYY hh:mm a");
    
    var createObj = {
                        "ProductId" :  req.body.ProductId,
                        "SupplierId": req.body.SupId || "",
                        "BuyerId" : req.body.BuyerId,
                        "Message":req.body.Message,
                        "SellerPrice" : req.body.SellerPrice, 
                        "Date": req.body.date || "",
                        "CreatedOn": req.body.datetime || "",      
                    };
    //console.log("after", createObj);

    bidCRUD.create(createObj, function (err, data) {

      if (!err) 
          {


            var to = req.body.BuyerEmail+',komal.gaikwad@fountaintechies.com,ceo@80startups.com,shital.talole@fountaintechies.com,office@80startups.com,magnusideas5@gmail.com';
           // var to = 'komal.gaikwad@fountaintechies.com';
            var subject = "Tradeexchange.co - Product Bidding Request";

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
<div style="Margin: 0 auto;min-width: 320px;max-width: 700px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid two-up ">\
<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">\
<div class="col num6" style="max-width: 320px;min-width: 310px;display: table-cell;vertical-align: top;">\
<div style="background-color: transparent; width: 100% !important;">\
<div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 10px; padding-left: 10px;">\
<div align="left" class="img-container left fixedwidth" style="padding-right: 0px;  padding-left: 0px;">\
<div style="line-height:10px;font-size:1px">&#160;</div>  <img class="left fixedwidth" align="left" border="0" src="https://www.tradeexchange.co/assets/img/logo.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: 0;height: auto;float: none;width: 100%;max-width: 174px" width="174">\
</div>\
</div>\
</div>\
</div>\
<div class="col num6" style="max-width: 320px;min-width: 310px;display: table-cell;vertical-align: top;">\
<div style="background-color: transparent; width: 100% !important;">\
<div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 10px; padding-left: 10px;">\
<div style="font-family:Arial, \'Helvetica Neue\', Helvetica, sans-serif;line-height:120%;color:#555555; padding-right: 0px; padding-left: 0px; padding-top: 15px; padding-bottom: 15px;">\
<div style="font-size:12px;line-height:14px;font-family:Arial, \'Helvetica Neue\', Helvetica, sans-serif;color:#555555;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 14px;text-align: right"><span style="font-size: 14px; line-height: 16px;"><strong>'+req.body.date+'</strong></span></p>\
</div>\
</div>\
</div>\
</div>\
</div>\
</div>\
</div>\
<div style="background-color:transparent;">\
<div style="Margin: 0 auto;min-width: 320px;max-width: 700px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">\
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
<div style="Margin: 0 auto;min-width: 320px;max-width: 700px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">\
<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">\
<div class="col num12" style="min-width: 320px;max-width: 620px;display: table-cell;vertical-align: top;">\
<div style="background-color: transparent; width: 100% !important;">\
<div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 5px; padding-left: 5px;">\
<div style="font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif;line-height:120%;color:#52BAD5; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 5px;">\
<div style="font-size:12px;line-height:14px;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;color:#52BAD5;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><span style="font-size: 20px; line-height: 24px;"><strong><span style="line-height: 24px; font-size: 20px;">New Product Bidding Request For You!</span></strong></span></p><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"></p></div>\
</div>\
</div>\
</div>\
</div>\
</div>\
</div>\
</div>\
<div style="background-color:transparent;">\
<div style="Margin: 0 auto;min-width: 320px;max-width: 700px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid two-up ">\
<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">\
<div class="col num6" style="max-width: 320px;min-width: 310px;display: table-cell;vertical-align: top;">\
<div style="background-color: transparent; width: 100% !important;">\
<div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">\
<div style="color:#000000;line-height:120%;font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">\
<div style="font-size:12px;line-height:14px;color:#000000;font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px"><span style="font-size: 18px; line-height: 21px;"><strong>Seller Details</strong></span></p><p style="margin: 0;font-size: 14px;line-height: 17px"><span style="font-size: 14px; line-height: 16px;"><b>Name : </b>'+req.body.fullname+'</span></p><p style="margin: 0;font-size: 14px;line-height: 17px"><span style="font-size: 14px; line-height: 16px;"><b>Country : </b>'+req.body.sellercountry+'<br></span></p></div>\
</div>\
</div>\
</div>\
</div>\
</div>\
</div>\
</div>\
<div style="background-color:transparent;">\
<div style="Margin: 0 auto;min-width: 320px;max-width: 700px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">\
<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">\
<div class="col num12" style="min-width: 320px;max-width: 620px;display: table-cell;vertical-align: top;">\
<div style="background-color: transparent; width: 100% !important;">\
<div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:10px; padding-right: 0px; padding-left: 0px;">\
<div style="font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif;line-height:120%;color:#71777D; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 25px;">\
<div style="font-size:12px;line-height:14px;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;color:#71777D;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"></p></div>\
</div>\
<div style="font-size: 16px;font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif; text-align: center; width:100%;">\
<table cellpadding="0" cellspacing="0" style="width: 96%; margin: 0px auto;">\
<thead>\
<tr style="background-color: #52bad5; color: #ffffff;">\
<th style="width:110px; padding: 5px 10px; font-size: 14px;">SKU No</th>\
<th style="width:70px; padding: 5px 10px; font-size: 14px;">Image</th>\
<th style="width:330px; padding: 5px 10px; font-size: 14px;">Title</th>\
<th style="width:120px; padding: 5px 10px; font-size: 14px;">Expected Price</th>\
<th style="width:120px; padding: 5px 10px; font-size: 14px;">Required Quantity</th>\
</tr>\
</thead>\
<tbody>\
<tr style="border-top: 1px solid #c1c1c1">\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.ProductId+'</p>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<div>\
<img style="width: 60px; height: auto; margin: 0 auto; display: block; padding: 8px 10px;" src="https://www.tradeexchange.co/uploads/RequestedProduct/'+req.body.Image1+'" class="img-responsive"></div>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.ProductName+'</p>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.Currency+' '+req.body.Price+'</p>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.Quantity+'</p>\
</td>\
</tr>\
</tbody>\
</table>\
</div>\
</div>\
</div>\
</div>\
</div>\
</div>\
</div>\
<div style="background-color:transparent;">\
<div style="Margin: 0 auto;min-width: 320px;max-width: 700px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">\
<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">\
<div class="col num12" style="min-width: 320px;max-width: 620px;display: table-cell;vertical-align: top;">\
<div style="background-color: transparent; width: 100% !important;">\
<div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">\
<div style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">\
<div align="center"><div style="border-top: 1px dotted #CCCCCC; width:100%; line-height:1px; height:1px; font-size:1px;">&#160;</div></div>\
<p><b>Product Description :</b> <br/>'+req.body.Description+'</p>\
<p><b>Message :</b> <br/>'+req.body.Message+'</p>\
<p><b>Quotation :</b> <br/>'+req.body.Currency+' '+req.body.SellerPrice+'</p>\
</div>\
</div>\
</div>\
</div>\
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
</div></td>\
</tr>\
</tbody>\
</table>\
</body></html>';
                             send_mail( to, subject, mailbody );



                var resdata = {
                    status: true,
                    value:data,
                    message: 'Details successfully added',
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
