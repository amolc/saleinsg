// ----receive function----v

var http = require('http');


function get_json(url, callback) {
    console.log('req here');
    console.log(url);
    http.get(url, function(res) {
        var body = '';
        res.on('data', function(chunk) {
            body += chunk;
        });
        res.on('end', function() {

            var response = JSON.parse(body);

          // call function ----v
            callback(response);
        });
    });
}

exports.products = function (req, res) {
    console.log('product-template api is called');
     var data=[];
    // routes for category
    var baseurl='http://localhost:9888/api/';
     apiURL1=baseurl + 'allproducts';
     console.log(apiURL1);

    // routes for country
     apiURL2=baseurl + 'allcountries';
     console.log(apiURL2);

     // rountes for sellers
     apiURL3=baseurl + 'allcategories';
     console.log(apiURL3);

    //  data['categoryData']={};
    //  data['productData']={};



get_json(apiURL2,function(val){
    console.log('api url 2');
    data['countryData']=val;
    console.log('Val length is ', val.length);
    if(val.length > 0){
        get_json(apiURL3,function(vals){
            data['categoryData']=vals;
            if(vals.length > 0){
                get_json(apiURL1,function(result){
                    data['productData']=result;
                    console.log('data is', data);
                    res.render('products.html', data);
                });
            }
        });
    }
});


};
