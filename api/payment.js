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
var depositCRUD = CRUD(db,'tbl_deposits');


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

exports.buyerdeposites = function (req, res) {

    var BuyerId = req.params.id;
    var sql = "SELECT * FROM `tbl_deposits` WHERE `BuyerId` = "+BuyerId+" AND `Type` = 'Deposit' ORDER BY DepId DESC";
    console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};


exports.deposit = function(req, res){
        //console.log(req.body);
        var token = req.body.stripeToken;
        var amount = req.body.amount ;
        var stripeToken = "" ;
        // Charge the user's card:
        var charge = stripe.charges.create({
          amount: amount,
          currency: "sgd",
          description: 'tradeexchange Deposit',
          source: token
        }, function(err, charge) {
          // asynchronously called
        //  console.log('err',err);
          if(!err){
              //  console.log('charge',charge);
                 stripetoken = charge.id ;

                // dateToday = now.format("DD/MM/YYYY hh:mm a");
                 var createObj = {

                      'BuyerId' : req.body.BuyerId,
                      'IPAddress' : req.body.ip,
                      'Amount' : req.body.amount,
                      'Currency' : req.body.Currency,
                      'Stripetoken' : stripetoken,
                      'Date' : req.body.date,
                      'DateTime' : req.body.datetime,
                      'Type' : 'Deposit',
                        
                  };

                depositCRUD.create(createObj,function(err, val) {

                    if (!err) 
                    {                          

                        var resdata = {
                            status: true,
                            value:val,
                            transactionid : stripetoken, 
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
                            

                      }


          else{
                  console.log('err',err);
                   var resdata = {
                            status: false,
                            error: err,
                            message: 'Error: Transaction Error. '
                        };

                        res.jsonp(resdata);
                }

        });


        // Send an email
};



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