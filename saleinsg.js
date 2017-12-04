var connect = require('connect');
var express = require('express');
var url = require('url');
var app = express();
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var path = require('path');
var bodyParser = require( 'body-parser' );
var nodemailer = require( 'nodemailer' );
var cors = require('cors');
var http = require("http").createServer(app);
fs = require('fs-extra');

var contact = require('./api/contact.js');
var startup = require('./api/startup.js');
var investor = require('./api/investor.js');
var seller = require('./api/seller.js');
var buyer = require('./api/buyer.js');
var message = require('./api/message.js');

/*app.use(function(req, res, next){
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	console.log(query);
	next();
});*/

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Credentials', false);
  next();
});

app.use(bodyParser.json({ limit: '50mb', extended: true, type:'application/json' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, type:'application/x-www-form-urlencoding' }));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.raw({ limit: '50mb' }));

var www = connect();
www.use(serveStatic('www'));
app.use('/', www);

app.post('/api/consult', contact.consult);
app.post('/api/apply', startup.apply);
app.post('/api/invest', investor.invest);

app.post('/api/register', contact.register);
app.get('/api/allcountries', contact.allcountries);
app.get('/api/verify-account/:id', contact.verifyAccount);
app.post('/api/login', contact.login);

app.get('/api/allcategories', contact.allcategories);
app.get('/api/getsubcategories/:id', contact.getsubcategories);

app.get('/api/allproducts', contact.allproducts);
app.get('/api/getProductDetails/:id', contact.getProductDetails);
app.get('/api/getProductSpecification/:id', contact.getProductSpecification);
app.post('/api/getrecentprod', contact.getrecentprod);

app.get('/api/getproductsbylocation/:id', contact.getproductsbylocation);
app.get('/api/filterbycategory/:id', contact.filterbycategory);
app.get('/api/filterbycountry/:id', contact.filterbycountry);
app.post('/api/filterbyCouCat', contact.filterbyCouCat);
app.post('/api/filterbyCatSub', contact.filterbyCatSub);
app.post('/api/filterbyall', contact.filterbyall);

app.post('/api/addorder', contact.addorder);
app.post('/api/addbankorder', contact.addbankorder);

app.get('/api/sellerorders/:id', seller.sellerorders);
app.post('/api/addproduct', seller.addproduct);
app.post('/api/addspecification', seller.addspecification);
app.get('/api/userproducts/:id', seller.userproducts);

app.get('/api/buyerorders/:id', buyer.buyerorders);
app.get('/api/shortlistedproducts/:id', buyer.shortlistedproducts);
app.post('/api/addtowishlist', buyer.addtowishlist);
app.post('/api/removefromwishlist', buyer.removefromwishlist);

app.post('/api/submitenquiry', message.submitenquiry);
app.get('/api/conversationlist/:id', message.conversationlist);
app.post('/api/conversation/', message.conversation);


app.listen(9888, function () {
  console.log('CORS-enabled web server listening on port 9888')
})
console.log("Magic at http://localhost:9888");
