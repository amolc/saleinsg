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
var messagesCRUD = CRUD(db, 'tbl_Messages');

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

                        }, function(err2, val2) {

                            if (!err2) 
                            { 
                              var createObj = {
                                "SenderId" :  req.body.BuyerId,
                                "ReceiverId": req.body.SupId || "",
                                "Message":req.body.message,
                                "MessageTime": dateToday || "",      
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
                                "Message":req.body.message,
                                "MessageTime": dateToday || "",      
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
    var sql = "select Max(m.MessageId) as Mid,s.`FirstName`,s.`LastName`,s.`SupId` from `tbl_Messages` as m , `tbl_Suppliers` as s WHERE (m.`ReceiverId` = s.`SupId` OR m.`SenderId` = s.`SupId`) AND (m.SenderId = "+UserId+" OR m.ReceiverId = "+UserId+") AND s.SupId != "+UserId+" GROUP BY s.`SupId` ORDER By Mid DESC";
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};

exports.conversation = function (req, res) {
    var UserId = req.body.userid;
    var OtherUserId = req.body.OtherUserId;
    var sql = "select m.MessageId as Mid,m.Message,m.MessageTime,s.`FirstName`,s.`LastName` from `tbl_Messages` as m , `tbl_Suppliers` as s WHERE ((m.SenderId = "+UserId+" AND m.ReceiverId="+OtherUserId+") OR(m.SenderId = "+OtherUserId+" AND m.ReceiverId="+UserId+")) AND m.SenderId = s.SupId GROUP BY Mid ORDER By Mid";
    //console.log(sql);
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
