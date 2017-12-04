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
var specificationCrud = CRUD(db, 'tbl_ProductSpecification');
var wishlistCrud = CRUD(db, 'tbl_ShortlistedProducts');
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


exports.buyerorders = function (req, res) {

    var BuyerId = req.params.id;
    var sql = "SELECT `OrderId`,p.`ProductName`,s.`CompanyName`,o.`TotalAmount`,o.`OrderDate`,o.`PaymentStatus` FROM `tbl_Orders` as o LEFT JOIN `tbl_Products` as p ON p.`ProductId` = o.`ProductId` LEFT JOIN `tbl_Suppliers` as s ON p.`SupplierId` = s.`SupId` WHERE o.`BuyerId` = "+BuyerId+" GROUP BY o.`OrderId` ORDER BY o.`OrderId` DESC";    //console.log(sql);
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};

exports.shortlistedproducts = function (req, res) {
    var BuyerId = req.params.id;
    var sql = "SELECT p.`ProductId`,p.`ProductName`,p.`Description`,p.`Price`,p.`Image1`,ct.`CategoryTitle`,c.`CountryFlag` FROM `tbl_ShortlistedProducts` as sl LEFT JOIN `tbl_Products` as p ON p.`ProductId` = sl.`ProductId` LEFT JOIN `tbl_Countries` as c ON c.`CountryId` = p.`CountryId` LEFT JOIN `tbl_Categories` as ct ON ct.`CategoryId` = p.`CategoryId` WHERE sl.`BuyerId` = "+BuyerId+" GROUP BY sl.`SpId` ORDER BY sl.`SpId` DESC";
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};

exports.removefromwishlist = function (req, res) {
    var BuyerId = req.body.BuyerId;
    var ProductId = req.body.ProductId;
    var sql = "DELETE FROM `tbl_ShortlistedProducts` WHERE ProductId = "+ProductId+" AND BuyerId = "+BuyerId;
    //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};

exports.addtowishlist = function (req, res) {

    var createObj = {
        "ProductId" :  req.body.ProductId,
        "BuyerId" : req.body.BuyerId,    
    };
    // console.log("after", createObj);

    wishlistCrud.create(createObj, function (err, data) {

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