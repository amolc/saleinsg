// Modules
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

// API's

var admin = require('./api/admin.js');
var contact = require('./api/contact.js');
var startup = require('./api/startup.js');
var investor = require('./api/investor.js');
var seller = require('./api/seller.js');
var buyer = require('./api/buyer.js');
var message = require('./api/message.js');
var payment = require('./api/payment.js');
var seo = require('./api/seo.js');
var routes = require('./routes/route.js');


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

// var views = connect();
// views.use(serveStatic('views'));
// app.use('/views', views);

var static = connect();
static.use(serveStatic('static'));
app.use('/static', static);

/* testing server side coding */
app.get('/api/seotags', seo.seotags);


app.post('/api/contactus', contact.contactus);



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
app.get('/api/productrequests', contact.productrequests);
app.get('/api/buyerproductrequests/:id', contact.buyerproductrequests);
app.get('/api/getProductDetails/:id', contact.getProductDetails);
app.get('/api/getReqProductDetails/:id', contact.getReqProductDetails);
app.get('/api/getProductSpecification/:id', contact.getProductSpecification);
app.get('/api/getSpecification/:id', contact.getSpecification);
app.post('/api/getrecentprod', contact.getrecentprod);
app.get('/api/featuredseller', contact.featuredseller);
 app.get('/api/getsellerinfo/:id', contact.getsellerinfo);
app.get('/api/getsellerinfobyname/:companyName', contact.getsellerinfobyname);

app.get('/api/getcurrency/:id', contact.getcurrency);
app.get('/api/getcountry/:id', contact.getcountry);
app.get('/api/getProductName/:id', contact.getProductName);
app.get('/api/getAllcurrency/', contact.getAllcurrency);
app.post('/api/changeCurrency/', contact.changeCurrency);
app.get('/api/getproductsbylocation/:id', contact.getproductsbylocation);
app.get('/api/filterbycategory/:id', contact.filterbycategory);
app.get('/api/filterbycountry/:id', contact.filterbycountry);
 app.get('/api/filterbyseller/:id', contact.filterbyseller);
//app.get('/api/filterbyseller/:sellerName', contact.filterbyseller);
app.get('/api/filterbyCouCat/:CountryId/:CategoryId', contact.filterbyCouCat);
app.get('/api/filterbyCatSub/:CategoryId/:SubCatId', contact.filterbyCatSub);

app.get('/api/filterbySelCat/:SellerId/:CategoryId', contact.filterbySelCat);
// app.post('/api/filterbyall', contact.filterbyall);
app.get('/api/filterbyall/:CountryId/:CategoryId/:SubCatId', contact.filterbyall);
app.get('/api/filterallbyseller/:SellerId/:CategoryId/:SubCatId', contact.filterallbyseller);
app.get('/api/getbiddings/:id', contact.getbiddings);

app.post('/api/addorder', contact.addorder);
app.post('/api/addbankorder', contact.addbankorder);

app.get('/api/sellerorders/:id', seller.sellerorders);
app.post('/api/addproduct', seller.addproduct);
app.post('/api/updateproduct', seller.updateproduct);
app.get('/api/disableProduct/:id', seller.disableProduct);
app.get('/api/enableProduct/:id', seller.enableProduct);
app.post('/api/addspecification', seller.addspecification);
app.post('/api/specedit', seller.specedit);
app.get('/api/showSpecification/:id', seller.showSpecification);
app.get('/api/deleteSpecification/:id', seller.deleteSpecification);
app.get('/api/userproducts/:id', seller.userproducts);
app.get('/api/getOrderDetails/:id', seller.getOrderDetails);
app.post('/api/GetOrderDetails', seller.GetOrderDetails);
app.get('/api/getTerms/:id', seller.getTerms);
app.post('/api/sellerTerms', seller.sellerTerms);
app.post('/api/sellerapprove', seller.sellerapprove);
app.get('/api/getHistory/:id', seller.getHistory);

app.get('/api/userinfo/:id', contact.userinfo);
app.post('/api/updateprofile', contact.updateprofile);
app.post('/api/updatebankdetails', contact.updatebankdetails);
app.post('/api/updatepassword', contact.updatepassword);

app.post('/api/requestproduct', buyer.requestproduct);
app.get('/api/buyerorders/:id', buyer.buyerorders);
app.get('/api/shortlistedproducts/:id', buyer.shortlistedproducts);
app.post('/api/addtowishlist', buyer.addtowishlist);
app.post('/api/removefromwishlist', buyer.removefromwishlist);
app.post('/api/placeorder', buyer.placeorder);
app.post('/api/addTerms', buyer.addTerms);
app.get('/api/getbuyerOrderDetails/:id', buyer.getbuyerOrderDetails);
app.post('/api/GetbuyerOrderDetails', buyer.GetbuyerOrderDetails);
app.post('/api/buyerTerms', buyer.buyerTerms);
app.post('/api/buyerapprove', buyer.buyerapprove);
app.post('/api/buyerdelete', buyer.buyerdelete);
app.get('/api/getBankDetails/:id', buyer.getBankDetails);

app.post('/api/submitenquiry', message.submitenquiry);
app.get('/api/conversationlist/:id', message.conversationlist);
app.post('/api/conversation/', message.conversation);
app.post('/api/sendmessage/', message.sendmessage);
app.post('/api/postbid', message.postbid);
app.get('/api/bidinfo/:id', contact.bidinfo);

app.post('/api/pay', payment.pay);

app.post('/api/deposit', payment.deposit);
app.get('/api/buyerdeposites/:id', payment.buyerdeposites);

app.post('/api/withdraw',buyer.withdraw);
app.post('/api/payNow',buyer.payNow);
app.get('/api/gettransactions/:id',buyer.gettransactions);

app.post('/api/adminlogin', admin.adminlogin);
app.get('/api/getAllUsers', admin.getAllUsers);
app.get('/api/getUserDetails/:id', admin.getUserDetails);
app.post('/api/sendmail', admin.sendmail);
app.get('/api/deleteUser/:id', admin.deleteUser);

// app.set('view engine', 'ejs');
// // use res.render to load up an ejs view file
// // index page
//
//
// app.get('/backend/', backend.index );
// app.get('/backend/about',backend.about);

// Express Nunjucks

const expressNunjucks = require('express-nunjucks');
const isDev = app.get('env') === 'development';
 app.set('views', __dirname + '/www');
const njk = expressNunjucks(app, {
  watch: isDev,
  noCache: isDev,
  autoescape:false,
  tags: {
      blockStart: '{%',
      blockEnd: '%}',
      variableStart: '{$',
      variableEnd: '$}',
      commentStart: '{#',
      commentEnd: '#}'
  }
});

app.get('//', routes.index);
app.get('/index.html', routes.index);
app.get('/products.html', routes.products);
app.get('/productsbyseller.html', routes.productsbyseller);
app.get('/product_detail.html', routes.productDetails);
app.get('/productsbysupplier.html', routes.productsbysupplier);



app.listen(9888, function () {
  console.log('CORS-enabled web server listening on port 9888');
  console.log("Magic at http://localhost:9888");
});

