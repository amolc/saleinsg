var http = require('http');
var mysql = require('mysql');
var db = mysql.createPool({
  database: 'saleinsg',
  user: 'root',
  password: '10gXWOqeaf',
  host: 'db.80startups.com',
});

var CRUD = require('mysql-crud');
var seocrud = CRUD(db, 'seotags');

exports.seotags = function (req, res) {

    var sql = "SELECT * from seotags where seoId='1'";
     //console.log(sql);
    db.query(sql, function (err, data) {
        res.json(data);
    });
};
