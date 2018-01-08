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
var specificationCrud = CRUD(db, 'tbl_ProductSpecification');
var enquiryCRUD = CRUD(db, 'tbl_SuppliersEnquiries');
var orderCRUD = CRUD(db, 'tbl_Orders');
var termsCRUD = CRUD(db, 'tbl_Terms');

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
         fileName = req.body.UserId+'_'+verifycode+'_'+req.body.imagename;
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
        "MinOrderQty" : req.body.minquantity,
        // "Category": req.body.category || "",
        // "SubCategory": req.body.subcat || "",
        "SupplierId": req.body.UserId || "",  
        "Currency" : req.body.currency  ,
        "Date"  : req.body.date,
        "ProductType" : "Product",
    };
    // console.log("after", createObj);

    productCRUD.create(createObj, function (err, data) {

        if (!err) 
        {

                             // var seller = req.body.SupEmail;
                              var subject = "Tradeexchange.co - New Product";
                            //  var to = 'komal.gaikwad@fountaintechies.com';
                              var to = req.body.SupEmail+',komal.gaikwad@fountaintechies.com,ceo@80startups.com,shital.talole@fountaintechies.com,office@80startups.com,magnusideas5@gmail.com';
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
<div style="font-size:12px;line-height:14px;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;color:#52BAD5;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><span style="font-size: 20px; line-height: 24px;"><strong><span style="line-height: 24px; font-size: 20px;">New Product Added!</span></strong></span></p><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"></p></div>\
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
<th style="width:120px; padding: 5px 10px; font-size: 14px;">Price</th>\
</tr>\
</thead>\
<tbody>\
<tr style="border-top: 1px solid #c1c1c1">\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+data.insertId+'</p>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<div>\
<img style="width: 60px; height: auto; margin: 0 auto; display: block; padding: 8px 10px;" src="https://www.tradeexchange.co/uploads/'+fileName+'" class="img-responsive"></div>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.name+'</p>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.currency+' '+req.body.price+'</p>\
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
<p><b>Product Description :</b> <br/>'+req.body.description+'</p>\
</div>\
</div>\
</div>\
</div>\
</div>\
</div>\
</div>\
<div style="font-size: 16px;font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif; text-align: center; width:100%;">\
<div style="padding: 10px;">\
<div><a href="https://www.tradeexchange.co/product_detail.html?id='+data.insertId+'" target="_blank" style="display: inline-block;padding: 9px 12px; background-color: #52bbd5;margin-top: 45px;color: #ffffff; text-decoration: none;">View Product</a></div></div>\
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

exports.updateproduct = function (req, res) {

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
         fileName = req.body.Image1;
         console.log("image not present");
     }
    
    //console.log(req.body.TypeId.TypeId);

    var updateObj = {
        "ProductName" :  req.body.ProductName,
        "Description": req.body.Description || "",
        "Price":req.body.Price || "",
        "Quantity": req.body.Quantity || "",
        "Image1": fileName || "",
        "CountryId" : req.body.CountryId,
        "CategoryId" : req.body.CategoryId,
        "SubCatId" : req.body.SubCatId,
        "MinOrderQty" : req.body. MinOrderQty, 
        "Currency" : req.body.Currency    
    };
    // console.log("after", createObj);
    productCRUD.update({ProductId: req.body.ProductId}, updateObj,function(err, val) {

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

exports.addspecification = function (req, res) {


    var createObj = {
        "ProductId" :  req.body.ProductId,
        "Title" : req.body.Title,
        "Description": req.body.Description || ""      
    };
    // console.log("after", createObj);

    specificationCrud.create(createObj, function (err, data) {

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


exports.specedit = function(req, res) {

    console.log('req.body',req.body);

    var now = moment();
    dateToday = now.format("YYYY-MM-DD H:mm:ss");

     var updateObj = {
                'ProductId': req.body.ProductId,
                'Title':  req.body.Title,
                'Description': req.body.Description,
    };



    if (req.body.SpecificationId)
     {       

         specificationCrud.update({SpecificationId: req.body.SpecificationId}, updateObj,function(err, val) {

        if (!err) 
        {
            var resdata = {
                status: true,
                value:val,
                message: 'update'
            };

            res.jsonp(resdata);
        }
        else
        {
            var resdata = {
                status: false,
                error: err,
                message: 'Could Not Update Details'
            };

            res.jsonp(resdata);
        }

    });

     }else{
        specificationCrud.create(updateObj, function(err, val) {

                console.log('return',val) ;

                if (!err) 
                {
                    var resdata = {
                        status: true,
                        value:val,
                        message: 'add'
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

   
    
};


exports.showSpecification = function (req, res) {
    var SpecificationId = req.params.id;
    console.log(SpecificationId);
    var sql = "SELECT * FROM `tbl_ProductSpecification` WHERE SpecificationId = "+SpecificationId;
   console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data[0]);
    });
};

exports.deleteSpecification = function (req, res) {
    var SpecificationId = req.params.id;
    var sql = "DELETE FROM `tbl_ProductSpecification` WHERE SpecificationId = "+SpecificationId;
    console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};


exports.disableProduct = function (req, res) {
    var ProductId = req.params.id;
    var sql = "UPDATE `tbl_Products` SET IsDisabled = '1' WHERE ProductId = "+ProductId;
   console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};


exports.enableProduct = function (req, res) {
    var ProductId = req.params.id;
    var sql = "UPDATE `tbl_Products` SET IsDisabled = '0' WHERE ProductId = "+ProductId;
    console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};


exports.userproducts = function (req, res) {
    var SupId = req.params.id;
    var sql = "SELECT p.`ProductId`,p.`ProductName`,p.`Currency`,p.`Description`,p.`Price`,p.`Image1`,p.`IsDisabled`,ct.`CategoryTitle`,c.`CountryFlag` FROM `tbl_Products` as p LEFT JOIN `tbl_Countries` as c ON c.`CountryId` = p.`CountryId` LEFT JOIN `tbl_Categories` as ct ON ct.`CategoryId` = p.`CategoryId` WHERE p.ProductType='Product' AND p.`SupplierId` = "+SupId+" GROUP BY p.`ProductId` ORDER BY p.`ProductId` DESC";
    console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};

exports.sellerorders = function (req, res) {
    var SellerId = req.params.id;
    var sql = "SELECT `OrderId`,p.`ProductName`,s.`FirstName`,s.`LastName`,o.`TotalAmount`,o.`OrderDate`,o.`PaymentStatus`,o.`OrderStatus` FROM `tbl_Orders` as o LEFT JOIN `tbl_Products` as p ON p.`ProductId` = o.`ProductId` LEFT JOIN `tbl_Suppliers` as s ON o.`BuyerId` = s.`SupId` WHERE o.`SuplierId` = "+SellerId+" GROUP BY o.`OrderId` ORDER BY o.`OrderId` DESC";    //console.log(sql);
   console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};

exports.getOrderDetails = function (req, res) {
    var OrderId = req.params.id;
    var sql = "SELECT o.*,p.`ProductName`,p.`Currency`,p.`ProductId`,p.`Image1`,s.`FirstName`,s.`LastName`,s.`Email`,s.`CompanyName`,c.`CountryTitle` FROM `tbl_Orders` as o LEFT JOIN `tbl_Products` as p ON p.`ProductId` = o.`ProductId` LEFT JOIN `tbl_Suppliers` as s ON o.`BuyerId` = s.`SupId` LEFT JOIN `tbl_Countries` as c ON s.`CountryId` = c.`CountryId` WHERE o.`OrderId` = "+OrderId;    
   console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data[0]);
    });
};

exports.GetOrderDetails = function (req, res) {
    var OrderId = req.body.OrderId;
    var SupplierId = req.body.SupplierId;
    var sql = "SELECT o.*,p.`ProductName`,p.`Currency`,p.`ProductId`,p.`Image1`,s.`FirstName`,s.`LastName`,s.`Email`,s.`CompanyName`,c.`CountryTitle` FROM `tbl_Orders` as o LEFT JOIN `tbl_Products` as p ON p.`ProductId` = o.`ProductId` LEFT JOIN `tbl_Suppliers` as s ON o.`BuyerId` = s.`SupId` LEFT JOIN `tbl_Countries` as c ON s.`CountryId` = c.`CountryId` WHERE o.`OrderId` = "+OrderId+" AND o.`SuplierId` = "+SupplierId;    
    console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data[0]);
    });
};

exports.getTerms = function (req, res) {
    var OrderId = req.params.id;
    var sql = "SELECT * FROM `tbl_Terms` WHERE OrderId = "+OrderId+" AND IsEdited = '0' ORDER BY TermId ASC";
    console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};

exports.sellerTerms = function (req, res) {
  // console.log(req.body);
   var sellername = req.body.order.sellername;
   var sellercountry = req.body.order.sellercountry;
   var buyername = req.body.order.FirstName+' '+req.body.order.LastName;
   var buyercountry = req.body.order.CountryTitle;
   var dateToday = now.format("YYYY-MM-DD H:mm:ss");
   
     var updateObj = {
                   "BuyerApproval" : 'Pending',
                   "SellerApproval" : 'Approved',
              };

    orderCRUD.update({OrderId: req.body.OrderId}, updateObj,function(err, val) {

         if (!err) 
        {

                  var updateObj = {
                 "IsEdited" : '1',
            };

   termsCRUD.update({OrderId: req.body.OrderId}, updateObj,function(err1, val1) {
           

                var table = '';

   for(var i=0;i<Object.keys(req.body.terms).length;i++)
      {
        //console.log(req.body[i].TermId);
       // if (req.body.remove[i] == 0) 
       //  {
           //  var orderID = req.body.terms[i].OrderId;                        
             var Terms = req.body.terms[i].Terms;
             var Type = req.body.terms[i].Type;
             var Percentage = req.body.terms[i].Percentage;
             var Amount = req.body.terms[i].Amount;

             var createObj = {
                 "OrderId" :  req.body.OrderId,
                 "Terms" : Terms, 
                 "Type" : Type, 
                 "Percentage" : Percentage,    
                 "Amount" : Amount, 
                 "SellerMessage" : 'You have sent proposal to buyer',
                 "BuyerMesssage" : 'You have received proposal from seller',
                 "TermDate" : req.body.date,
                 "TermDateTime" : req.body.datetime,
            };
             //console.log("after", createObj);
            termsCRUD.create(createObj, function (err2, data2) {

                                                  
             });

              table += '<tr style="border-top: 1px solid #c1c1c1">\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.terms[i].Terms+'</p>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<div>\
<p style="margin: 0px; font-size: 14px;">'+req.body.terms[i].Type+'</p>\
</div>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.terms[i].Percentage+' %</p>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.order.Currency+' '+req.body.terms[i].Amount+'</p>\
</td>\
</tr>';


                                                                   
              }


  var buyer = req.body.order.Email+',ceo@80startups.com,shital.talole@fountaintechies.com,office@80startups.com,magnusideas5@gmail.com';
  var seller = req.body.order.selleremail+',ceo@80startups.com,shital.talole@fountaintechies.com,office@80startups.com,magnusideas5@gmail.com';
   // console.log(buyer);
   // console.log(seller);                            

              // var buyer = 'komal.gaikwad@fountaintechies.com';
              // var seller = 'komal.gaikwad@fountaintechies.com';
               var subject = "Tradeexchange Updated Proposal- "+req.body.order.OrderId;

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
<p style="margin: 25px 0px 0px; font-size: 13px; line-height: 14px; text-align: right; text-transform: uppercase; font-weight: 600;">Order Status : <span style="color: red;">Approved</span>\
</p>\
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
<div style="font-size:12px;line-height:14px;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;color:#52BAD5;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><span style="font-size: 20px; line-height: 24px;"><strong><span style="line-height: 24px; font-size: 20px;">You Have Received Updated Proposal!</span></strong></span></p><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"></p></div>\
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
<div style="font-size:12px;line-height:14px;color:#000000;font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px"><span style="font-size: 18px; line-height: 21px;"><strong>Shipping Address</strong></span></p><p style="margin: 0;font-size: 14px;line-height: 17px"><span style="font-size: 14px; line-height: 16px;"><b>Name : </b>'+req.body.order.FirstName+' '+req.body.order.LastName+'</span></p><p style="margin: 0;font-size: 14px;line-height: 17px"><span style="font-size: 14px; line-height: 16px;"><b>Address Line 1 : </b>'+req.body.order.Address1+' <br><b>Address Line 2 :</b> '+req.body.order.Address2+' <br><b>Postal Code :</b> '+req.body.order.PostalCode+'<br><b>Country : </b>'+req.body.order.Country+'<br></span></p></div>\
</div>\
</div>\
</div>\
</div>\
<div class="col num6" style="max-width: 320px;min-width: 310px;display: table-cell;vertical-align: top;">\
<div style="background-color: transparent; width: 100% !important;">\
<div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">\
<div style="color:#000000;line-height:120%;font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">\
<div style="font-size:12px;line-height:14px;color:#000000;font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: right"><strong><span style="font-size: 18px; line-height: 21px;">Seller Details</span></strong><br></p><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: right"><span style="font-size: 14px; line-height: 16px;"><b>Name :</b> '+sellername+'</span></p><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: right"><span style="font-size: 14px; line-height: 16px;"> <b>Country :</b> '+sellercountry+'<br><br></span></p></div>\
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
<th style="width:120px; padding: 5px 10px; font-size: 14px;">Unit Price</th>\
<th style="width:50px; padding: 5px 10px; font-size: 14px;">Qty</th>\
<th style="width:170px; padding: 5px 10px; font-size: 14px;">Total Amount</th>\
</tr>\
</thead>\
<tbody>\
<tr style="border-top: 1px solid #c1c1c1">\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.order.ProductId+'</p>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<div>\
<img style="width: 60px; height: auto; margin: 0 auto; display: block; padding: 8px 10px;" src="https://www.tradeexchange.co/uploads/'+req.body.order.Image1+'" class="img-responsive"></div>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.order.ProductName+'</p>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.order.Currency+' '+req.body.order.Price+'</p>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.order.Quantity+'</p>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.order.Currency+' '+req.body.order.TotalAmount+'</p>\
</td>\
</tr>\
</tbody>\
</table>\
</div>\
<div style="font-size: 16px;font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif; text-align: center; width:100%;">\
<div style="padding: 10px;">\
<h4 style="text-align: left;">Terms</h4>\
<table cellpadding="0" cellspacing="0" style="width: 100%; margin: 0px auto;">\
<thead>\
<tr style="background-color: #52bad5; color: #ffffff;">\
<th style="width:110px; padding: 5px 10px; font-size: 14px;">Title</th>\
<th style="width:330; padding: 5px 10px; font-size: 14px;">Type</th>\
<th style="width:50; padding: 5px 10px; font-size: 14px;">%</th>\
<th style="width:120px; padding: 5px 10px; font-size: 14px;">Amount</th>\
</tr>\
</thead>\
<tbody>'+table+'</tbody>\
</table>\
<div><a href="https://www.tradeexchange.co/buyer-order-details.html?id='+req.body.order.OrderId+'" target="_blank" style="display: inline-block;padding: 9px 12px; background-color: #52bbd5;margin-top: 45px;color: #ffffff; text-decoration: none;">View Orders</a></div></div>\
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



                  send_mail( buyer, subject, mailbody );


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
<div style="font-size:12px;line-height:14px;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;color:#52BAD5;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><span style="font-size: 20px; line-height: 24px;"><strong><span style="line-height: 24px; font-size: 20px;">You Have Sent Updated Proposal!</span></strong></span></p><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"></p></div>\
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
<div style="font-size:12px;line-height:14px;color:#000000;font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px"><span style="font-size: 18px; line-height: 21px;"><strong>Shipping Address</strong></span></p><p style="margin: 0;font-size: 14px;line-height: 17px"><span style="font-size: 14px; line-height: 16px;"><b>Name : </b>'+req.body.order.FirstName+' '+req.body.order.LastName+'</span></p><p style="margin: 0;font-size: 14px;line-height: 17px"><span style="font-size: 14px; line-height: 16px;"><b>Address Line 1 : </b>'+req.body.order.Address1+' <br><b>Address Line 2 :</b> '+req.body.order.Address2+' <br><b>Postal Code :</b> '+req.body.order.PostalCode+'<br><b>Country : </b>'+req.body.order.Country+'<br></span></p></div>\
</div>\
</div>\
</div>\
</div>\
<div class="col num6" style="max-width: 320px;min-width: 310px;display: table-cell;vertical-align: top;">\
<div style="background-color: transparent; width: 100% !important;">\
<div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">\
<div style="color:#000000;line-height:120%;font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">\
<div style="font-size:12px;line-height:14px;color:#000000;font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: right"><strong><span style="font-size: 18px; line-height: 21px;">Buyer Details</span></strong><br></p><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: right"><span style="font-size: 14px; line-height: 16px;"><b>Name :</b> '+buyername+'</span></p><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: right"><span style="font-size: 14px; line-height: 16px;"> <b>Country :</b> '+buyercountry+'<br><br></span></p></div>\
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
<th style="width:120px; padding: 5px 10px; font-size: 14px;">Unit Price</th>\
<th style="width:50px; padding: 5px 10px; font-size: 14px;">Qty</th>\
<th style="width:170px; padding: 5px 10px; font-size: 14px;">Total Amount</th>\
</tr>\
</thead>\
<tbody>\
<tr style="border-top: 1px solid #c1c1c1">\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.order.ProductId+'</p>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<div>\
<img style="width: 60px; height: auto; margin: 0 auto; display: block; padding: 8px 10px;" src="https://www.tradeexchange.co/uploads/'+req.body.order.Image1+'" class="img-responsive"></div>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.order.ProductName+'</p>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.order.Currency+' '+req.body.order.Price+'</p>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.order.Quantity+'</p>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.order.Currency+' '+req.body.order.TotalAmount+'</p>\
</td>\
</tr>\
</tbody>\
</table>\
</div>\
<div style="font-size: 16px;font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif; text-align: center; width:100%;">\
<div style="padding: 10px;">\
<h4 style="text-align: left;">Terms</h4>\
<table cellpadding="0" cellspacing="0" style="width: 100%; margin: 0px auto;">\
<thead>\
<tr style="background-color: #52bad5; color: #ffffff;">\
<th style="width:110px; padding: 5px 10px; font-size: 14px;">Title</th>\
<th style="width:330; padding: 5px 10px; font-size: 14px;">Type</th>\
<th style="width:50; padding: 5px 10px; font-size: 14px;">%</th>\
<th style="width:120px; padding: 5px 10px; font-size: 14px;">Amount</th>\
</tr>\
</thead>\
<tbody>'+table+'</tbody>\
</table>\
<div><a href="https://www.tradeexchange.co/seller-order-details.html?id='+req.body.order.OrderId+'" target="_blank" style="display: inline-block;padding: 9px 12px; background-color: #52bbd5;margin-top: 45px;color: #ffffff; text-decoration: none;">View Orders</a></div></div>\
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
            
            send_mail( seller, subject, mailbody );

            var resdata = {
                status: true,
                value:val,
                message: 'Details successfully updated'
            };

            res.jsonp(resdata);

          });


        }
        else
        {

            var resdata = {
                status: false,
                error: val,
                message: 'Error: Details not successfully updated. '
            };

            res.jsonp(resdata);

        }

   

      });
                 

  
    //  var resdata = {
    //                     status: true,
    //                     message: 'Terms Updated. '
    //                 };

    // res.jsonp(resdata);
};

exports.sellerapprove = function (req, res) {
    //console.log(req.body);
   // console.log(req.body.order.sellername);
   // console.log(req.body.order.sellercountry);
   var sellername = req.body.order.sellername;
   var sellercountry = req.body.order.sellercountry;
   var buyername = req.body.order.FirstName+' '+req.body.order.LastName;
   var buyercountry = req.body.order.CountryTitle;
   var dateToday = now.format("YYYY-MM-DD H:mm:ss");
   // console.log(sellername);
   // console.log(sellercountry);
   // console.log(buyername);
   // console.log(buyercountry);
   var updateObj = {
                 "OrderStatus" : 'Approved',
                 "SellerApproval" : 'Approved',
                 "ConfimationDate" : req.body.datetime
            };

    orderCRUD.update({OrderId: req.body.order.OrderId}, updateObj,function(err, val) {     

       if (!err) 
        {

            var updateObj = {
                   "IsEdited" : '1',
              };

            termsCRUD.update({OrderId: req.body.order.OrderId}, updateObj,function(err1, val1) {


                var table = '';

          for(var i=0;i<Object.keys(req.body.terms).length;i++)
            {    

               var Terms = req.body.terms[i].Terms;
               var Type = req.body.terms[i].Type;
               var Percentage = req.body.terms[i].Percentage;
               var Amount = req.body.terms[i].Amount;

               var createObj = {
                   "OrderId" :  req.body.order.OrderId,
                   "Terms" : Terms, 
                   "Type" : Type, 
                   "Percentage" : Percentage,    
                   "Amount" : Amount, 
                   "SellerMessage" : 'You have approved the order',
                   "BuyerMesssage" : 'Order approved by seller',
                   "TermDate" : req.body.date,
                   "TermDateTime" : req.body.datetime,
              };
                                               // console.log("after", createObj);
              termsCRUD.create(createObj, function (err2, data2) {
                                                    
               });

              table += '<tr style="border-top: 1px solid #c1c1c1">\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.terms[i].Terms+'</p>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<div>\
<p style="margin: 0px; font-size: 14px;">'+req.body.terms[i].Type+'</p>\
</div>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.terms[i].Percentage+' %</p>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.order.Currency+' '+req.body.terms[i].Amount+'</p>\
</td>\
</tr>';

            
                                              
            }



  var buyer = req.body.order.Email+',ceo@80startups.com,shital.talole@fountaintechies.com,office@80startups.com,magnusideas5@gmail.com';
  var seller = req.body.order.selleremail+',ceo@80startups.com,shital.talole@fountaintechies.com,office@80startups.com,magnusideas5@gmail.com';
   // console.log(buyer);
   // console.log(seller);                            

              // var buyer = 'komal.gaikwad@fountaintechies.com';
              // var seller = 'komal.gaikwad@fountaintechies.com';
               var subject = "Tradeexchange Order Confirmation- "+req.body.order.OrderId;

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
<p style="margin: 25px 0px 0px; font-size: 13px; line-height: 14px; text-align: right; text-transform: uppercase; font-weight: 600;">Order Status : <span style="color: red;">Approved</span>\
</p>\
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
<div style="font-size:12px;line-height:14px;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;color:#52BAD5;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><span style="font-size: 20px; line-height: 24px;"><strong><span style="line-height: 24px; font-size: 20px;">Your Order Is Confirmed!</span></strong></span></p><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"></p></div>\
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
<div style="font-size:12px;line-height:14px;color:#000000;font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px"><span style="font-size: 18px; line-height: 21px;"><strong>Shipping Address</strong></span></p><p style="margin: 0;font-size: 14px;line-height: 17px"><span style="font-size: 14px; line-height: 16px;"><b>Name : </b>'+req.body.order.FirstName+' '+req.body.order.LastName+'</span></p><p style="margin: 0;font-size: 14px;line-height: 17px"><span style="font-size: 14px; line-height: 16px;"><b>Address Line 1 : </b>'+req.body.order.Address1+' <br><b>Address Line 2 :</b> '+req.body.order.Address2+' <br><b>Postal Code :</b> '+req.body.order.PostalCode+'<br><b>Country : </b>'+req.body.order.Country+'<br></span></p></div>\
</div>\
</div>\
</div>\
</div>\
<div class="col num6" style="max-width: 320px;min-width: 310px;display: table-cell;vertical-align: top;">\
<div style="background-color: transparent; width: 100% !important;">\
<div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">\
<div style="color:#000000;line-height:120%;font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">\
<div style="font-size:12px;line-height:14px;color:#000000;font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: right"><strong><span style="font-size: 18px; line-height: 21px;">Seller Details</span></strong><br></p><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: right"><span style="font-size: 14px; line-height: 16px;"><b>Name :</b> '+sellername+'</span></p><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: right"><span style="font-size: 14px; line-height: 16px;"> <b>Country :</b> '+sellercountry+'<br><br></span></p></div>\
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
<th style="width:120px; padding: 5px 10px; font-size: 14px;">Unit Price</th>\
<th style="width:50px; padding: 5px 10px; font-size: 14px;">Qty</th>\
<th style="width:170px; padding: 5px 10px; font-size: 14px;">Total Amount</th>\
</tr>\
</thead>\
<tbody>\
<tr style="border-top: 1px solid #c1c1c1">\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.order.ProductId+'</p>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<div>\
<img style="width: 60px; height: auto; margin: 0 auto; display: block; padding: 8px 10px;" src="https://www.tradeexchange.co/uploads/'+req.body.order.Image1+'" class="img-responsive"></div>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.order.ProductName+'</p>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.order.Currency+' '+req.body.order.Price+'</p>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.order.Quantity+'</p>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.order.Currency+' '+req.body.order.TotalAmount+'</p>\
</td>\
</tr>\
</tbody>\
</table>\
</div>\
<div style="font-size: 16px;font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif; text-align: center; width:100%;">\
<div style="padding: 10px;">\
<h4 style="text-align: left;">Terms</h4>\
<table cellpadding="0" cellspacing="0" style="width: 100%; margin: 0px auto;">\
<thead>\
<tr style="background-color: #52bad5; color: #ffffff;">\
<th style="width:110px; padding: 5px 10px; font-size: 14px;">Title</th>\
<th style="width:330; padding: 5px 10px; font-size: 14px;">Type</th>\
<th style="width:50; padding: 5px 10px; font-size: 14px;">%</th>\
<th style="width:120px; padding: 5px 10px; font-size: 14px;">Amount</th>\
</tr>\
</thead>\
<tbody>'+table+'</tbody>\
</table>\
<div><a href="https://www.tradeexchange.co/buyer-order-details.html?id='+req.body.order.OrderId+'" target="_blank" style="display: inline-block;padding: 9px 12px; background-color: #52bbd5;margin-top: 45px;color: #ffffff; text-decoration: none;">View Orders</a></div></div>\
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



                  send_mail( buyer, subject, mailbody );


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
<div style="font-size:12px;line-height:14px;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;color:#52BAD5;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><span style="font-size: 20px; line-height: 24px;"><strong><span style="line-height: 24px; font-size: 20px;">You Have Confirmed Order!</span></strong></span></p><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"></p></div>\
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
<div style="font-size:12px;line-height:14px;color:#000000;font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px"><span style="font-size: 18px; line-height: 21px;"><strong>Shipping Address</strong></span></p><p style="margin: 0;font-size: 14px;line-height: 17px"><span style="font-size: 14px; line-height: 16px;"><b>Name : </b>'+req.body.order.FirstName+' '+req.body.order.LastName+'</span></p><p style="margin: 0;font-size: 14px;line-height: 17px"><span style="font-size: 14px; line-height: 16px;"><b>Address Line 1 : </b>'+req.body.order.Address1+' <br><b>Address Line 2 :</b> '+req.body.order.Address2+' <br><b>Postal Code :</b> '+req.body.order.PostalCode+'<br><b>Country : </b>'+req.body.order.Country+'<br></span></p></div>\
</div>\
</div>\
</div>\
</div>\
<div class="col num6" style="max-width: 320px;min-width: 310px;display: table-cell;vertical-align: top;">\
<div style="background-color: transparent; width: 100% !important;">\
<div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">\
<div style="color:#000000;line-height:120%;font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">\
<div style="font-size:12px;line-height:14px;color:#000000;font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: right"><strong><span style="font-size: 18px; line-height: 21px;">Buyer Details</span></strong><br></p><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: right"><span style="font-size: 14px; line-height: 16px;"><b>Name :</b> '+buyername+'</span></p><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: right"><span style="font-size: 14px; line-height: 16px;"> <b>Country :</b> '+buyercountry+'<br><br></span></p></div>\
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
<th style="width:120px; padding: 5px 10px; font-size: 14px;">Unit Price</th>\
<th style="width:50px; padding: 5px 10px; font-size: 14px;">Qty</th>\
<th style="width:170px; padding: 5px 10px; font-size: 14px;">Total Amount</th>\
</tr>\
</thead>\
<tbody>\
<tr style="border-top: 1px solid #c1c1c1">\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.order.ProductId+'</p>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<div>\
<img style="width: 60px; height: auto; margin: 0 auto; display: block; padding: 8px 10px;" src="https://www.tradeexchange.co/uploads/'+req.body.order.Image1+'" class="img-responsive"></div>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.order.ProductName+'</p>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.order.Currency+' '+req.body.order.Price+'</p>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.order.Quantity+'</p>\
</td>\
<td style="text-align: center; padding: 8px 10px;">\
<p style="margin: 0px; font-size: 14px;">'+req.body.order.Currency+' '+req.body.order.TotalAmount+'</p>\
</td>\
</tr>\
</tbody>\
</table>\
</div>\
<div style="font-size: 16px;font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif; text-align: center; width:100%;">\
<div style="padding: 10px;">\
<h4 style="text-align: left;">Terms</h4>\
<table cellpadding="0" cellspacing="0" style="width: 100%; margin: 0px auto;">\
<thead>\
<tr style="background-color: #52bad5; color: #ffffff;">\
<th style="width:110px; padding: 5px 10px; font-size: 14px;">Title</th>\
<th style="width:330; padding: 5px 10px; font-size: 14px;">Type</th>\
<th style="width:50; padding: 5px 10px; font-size: 14px;">%</th>\
<th style="width:120px; padding: 5px 10px; font-size: 14px;">Amount</th>\
</tr>\
</thead>\
<tbody>'+table+'</tbody>\
</table>\
<div><a href="https://www.tradeexchange.co/seller-order-details.html?id='+req.body.order.OrderId+'" target="_blank" style="display: inline-block;padding: 9px 12px; background-color: #52bbd5;margin-top: 45px;color: #ffffff; text-decoration: none;">View Orders</a></div></div>\
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
            
            send_mail( seller, subject, mailbody );

            var resdata = {
                status: true,
                value:val,
                message: 'Details successfully updated'
            };

            res.jsonp(resdata);
                       


                       });  

           
        }
        else
        {
            var resdata = {
                status: false,
                error: val,
                message: 'Error: Details not successfully updated. '
            };

            res.jsonp(resdata);
        }

    
    });
                

};

exports.getHistory = function (req, res) {
    var OrderId = req.params.id;
    var sql = "SELECT  `SellerMessage`,`BuyerMesssage`,`TermDate` FROM `tbl_Terms` WHERE OrderId = "+OrderId +" GROUP BY TermDateTime ORDER BY TermId DESC";
   console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
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