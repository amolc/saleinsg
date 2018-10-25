// ----receive function----v

var http = require('http');


function get_json(url, callback) {
    http.get(url, function(res) {
        var body = '';
        res.on('data', function(chunk) {
            body += chunk;
        });
        res.on('end', function() {
            console.log(body);
            var response = JSON.parse(body);
            console.log(response);
          // call function ----v
            callback(response);
        });
    });
}

exports.products = function (req, res) {
    console.log('product-template api is called');
     var data=[];
     
    // routes for category
    var baseurl='http://localhost:9888/api/'
     apiURL1=baseurl + 'allproducts'
     console.log(apiURL1)

    // routes for country
     apiURL2=baseurl + 'allcountries';
     console.log(apiURL2)

     // rountes for sellers
     apiURL3=baseurl + 'allcategories';
     console.log(apiURL3)

     get_json(apiURL3,function(val){
        data['categoryData']=val;
        if(val.length>0){
            get_json(apiURL1,function(res){
                data['productData']=res;
                if(res.length>0){
                    get_json(apiURL2,function(result){
                        data['countryData']=result;
                    })
                   
                }
            })
        }
        console.log('data is', data)
        res.render('products.html', data);
});

console.log('here');


};
