// ----receive function----v

var http = require('http');

function get_json(url, callback) {
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

         // -----------the url---v         ------------the callback---v

exports.products = function (req, res) {

    var jsondata = [{ seoId: 1,
    title: 'This is a test of our seotag',
    description: 'We are in the description of the seo tags',
    keywords: 'this keyword,that keyword, keyword keyword everywhere',
    special: '' }];

    res.render('products_template.html', {data: jsondata});

};
