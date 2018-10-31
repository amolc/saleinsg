// ----receive function----v

var http = require('http');
var baseurl='http://localhost:9888/api/';
var data=[];

function get_json(url, callback) {
    http.get(url, function(res) {
        var body = '';
        res.on('data', function(chunk) {
            body += chunk;
        });
        res.on('end', function() {
            var response = JSON.parse(body);
          // call function ----v
        //   console.log('api data result is:', body);
            callback(response);
        });
    });
}

// for index page

exports.index=function(req,res){
    console.log('index page api is called');
    get_json(baseurl + 'allproducts',function(val){
        data['productData']=val;
        if(val.length>=0){
            get_json(baseurl + 'featuredseller',function(resp){
                data['sellerData']=resp;
                 console.log('data on home page is:', data);
                res.render('homepage.html', data);
            });
        }
    });
};

// for product_details page

exports.productDetails=function(req,res){
    var url=req.url;
    urlpart=url.split("?");
    urlparams=urlpart;
    console.log(urlparams);
    var updatedUrlParams=urlparams[1].split('=');
    console.log(baseurl+'getProductSpecification/'+updatedUrlParams[1]);
    get_json(baseurl+'getProductSpecification/'+updatedUrlParams[1],function(val){
        data['productData']=val;
        var sellerId= data['productData'][0].SupplierId;
        console.log('seller id is: ',sellerId);
        if(val.length>=0){
            get_json(baseurl + 'getsellerinfo/'+sellerId,function(values){
                data['sellerData']=values;
                if(values.length>=0){
                    console.log(baseurl+'getSpecification/'+updatedUrlParams[1]);
                    get_json(baseurl+'getSpecification/'+updatedUrlParams[1],function(respo){
                        data['productSpecification']=respo;
                        console.log(data);
                        res.render('productDetails',data);
                    });

                }
            });
        }

    });
};


// for products by seller name
exports.productsbysupplier=function(req,res){
    console.log('productsbysupplier api is called');
    var url = req.url;
    console.log(url);
    var parts = url.split("?");
    if(parts.length>1){
        console.log(parts);
        var urlparams=parts[1];
        var urlpart=urlparams.split('=');
        console.log(urlpart);
        var updatedUrlParams=urlpart[1].split('%20').join(' ');
        console.log(updatedUrlParams);
        // var id=urlpart[1];
        console.log('countries');
        get_json(baseurl + 'allcountries',function(val){
            data['countryData']=val;
            if(val.length>=0){
                console.log('categories');
                get_json(baseurl + 'allcategories',function(vals){
                    data['categorydata']=vals;
                    console.log(vals.length);
                    if(vals.length >=0){
                        console.log(baseurl + 'filterbyseller/'+updatedUrlParams);
                        get_json(baseurl + 'filterbyseller/'+ updatedUrlParams,function(valu){
                            data['productData']=valu;
                            if(valu.length>=0){
                                console.log(baseurl + 'getsellerinfobyname/'+updatedUrlParams);
                                get_json(baseurl + 'getsellerinfo/'+updatedUrlParams,function(respo){
                                    data['sellerData']=respo;
                                    console.log('rendered data', data);
                                    res.render('productsbyseller',data);
                                });
                            }
                        });
                    }
                });
            }
        });

    }
};

// for product by seller page with seller Id

exports.productsbyseller = function(req,res){
    console.log('productsbyseller api is called');
    var url = req.url;
    console.log(url);
    var parts = url.split("?");
    if(parts.length>1){
        console.log(parts);
        var urlparams=parts[1];
        var urlpart=urlparams.split('=');
        console.log(urlpart);
        var updatedUrlParams=urlpart[1];

        console.log(updatedUrlParams);
        // var id=urlpart[1];
        console.log('countries');
        get_json(baseurl + 'allcountries',function(val){
            data['countryData']=val;
            if(val.length>=0){
                console.log('categories');
                get_json(baseurl + 'allcategories',function(vals){
                    data['categorydata']=vals;
                    console.log(vals.length);
                    if(vals.length >=0){
                        console.log(baseurl + 'filterbyseller/'+updatedUrlParams);
                        get_json(baseurl + 'filterbyseller/'+updatedUrlParams,function(valu){
                            data['productData']=valu;
                            if(valu.length>=0){
                                console.log(baseurl + 'getsellerinfo/'+updatedUrlParams);
                                get_json(baseurl + 'getsellerinfo/'+updatedUrlParams,function(respo){
                                    data['sellerData']=respo;
                                    console.log('rendered data', data);
                                    res.render('productBySeller',data);
                                });

                            }

                        });
                    }
                });
            }
        });

    }

};

// for product page

exports.products = function (req, res) {
    console.log('product api is called');

    var url = req.url;
    console.log(url);
    var parts = url.split("?");

    if(parts.length>1){
    console.log('will continue');
    var urlparams = parts[1];
    console.log(urlparams);
    var urlpart = urlparams.split('&');
    console.log(urlpart);
    console.log(urlpart.length);

    if(urlpart.length == 1){
        var id = urlpart[0].split("=");
        if(id[0]=='country'){
            get_json(baseurl + 'allcountries',function(val){
                data['countryData']=val;
                if(val.length > 0){
                    get_json(baseurl + 'allcategories',function(vals){
                        data['categoryData']=vals;
                        if(vals.length > 0){
                            get_json(baseurl+'filterbycountry/' + id[1] ,function(result){
                                data['productData']=result;
                                console.log('Data is rendered!');
                                res.render('products1.html', data);

                            });
                        }
                    });
                }
            });
        }else if(id[0]=='category'){
            console.log('category filter api callled');
            get_json(baseurl + 'allcountries',function(val){
                data['countryData']=val;
                if(val.length >= 0){
                    get_json(baseurl + 'allcategories',function(vals){
                        data['categoryData']=vals;
                        if(vals.length >= 0){
                            console.log(baseurl+'filterbycategory/' + id[1]);

                            get_json(baseurl+'filterbycategory/' + id[1] ,function(result){
                                console.log('products by categoryfilter call start from here and result is :',result);
                                data['productData']=result;
                                console.log('Data is rendered!');
                                res.render('products1.html', data);

                            });
                        }
                    });
                }
            });
        } else if(id[0]=='seller'){
            get_json(baseurl + 'allcountries',function(val){
                data['countryData']=val;
                if(val.length > 0){
                    get_json(baseurl + 'allcategories',function(vals){
                        data['categoryData']=vals;
                        if(vals.length > 0){
                            get_json(baseurl+'filterbyseller/' + id[1],function(result){
                                data['productData']=result;
                                if(result.length>0){
                                    get_json(baseurl+ 'getAllcurrency/',function(resp){
                                        data['currencyList']=resp;
                                        console.log('Data is rendered!');
                                        res.render('products1.html', data);

                                    });
                                }
                            });
                        }
                    });
                }
            });
        }

    console.log('1 param in url');

    }else if(urlpart.length== 2){
        console.log('url part is:',urlpart);
        // var urlpart = urlparams.split('&');
        var id1 = urlpart[0].split("=");
        var id2= urlpart[1].split("=");
        console.log(id1);
        console.log(id2);

        if(id1[0]=='country' && id2[0]=='category'){
            console.log('fillter by category and country');
            get_json(baseurl + 'allcountries',function(val){
                data['countryData']=val;
                console.log('country data');
                if(val.length > 0){
                    get_json(baseurl + 'allcategories',function(vals){
                        data['categoryData']=vals;
                        console.log('category data');
                        console.log('category length is:', vals.length);
                        if(vals.length > 0){
                            console.log('product data apii call for country category filter');
                            get_json(baseurl+'filterbyCouCat'+'/'+id1[1]+'/'+id2[1],function(result){
                                data['productData']=result;
                                if(result.length>0){
                                    get_json(baseurl+ 'getAllcurrency/',function(resp){
                                        data['currencyList']=resp;
                                        console.log('Data is rendered!');
                                        res.render('products1.html', data);

                                    });
                                }
                            });

                        }

                    });
                }
            });


        } if (id1[0]=='category' && id2[0]== 'subcategory'){
            console.log('category & sub category api call');
            get_json(baseurl + 'allcountries',function(val){
                data['countryData']=val;
                if(val.length > 0){
                    get_json(baseurl + 'allcategories',function(vals){
                        data['categoryData']=vals;
                        if(vals.length > 0){
                            console.log(baseurl+'filterbyCatSub'+'/'+id1[1]+'/'+id2[1]);
                            get_json(baseurl+'filterbyCatSub'+'/'+id1[1]+'/'+id2[1],function(result){
                                data['productData']=result;
                                console.log('Data is rendered!');
                                console.log('category & sub category filter data',data);
                                res.render('products1.html', data);
                                // if(result.length>0){
                                //     get_json(baseurl+ 'getAllcurrency/',function(resp){
                                //         data['currencyList']=resp;
                                //         if(result.length>=0){
                                //             get_json(baseurl+ 'getAllcurrency/',function(resp){
                                //                 data['currencyList']=resp;
                                //                 if(resp >= 0){
                                //                     console.log('cat id id ',id[1]);
                                //                     get_json(baseurl+'getsubcategories/'+id[1],function(respo){
                                //                         data['subCatList']=respo;
                                //                     });
                                //                 }
                                //             });
                                //         }

                                //     });
                                // }
                            });
                        }
                    });
                }
            });

        }if(id1[0]=='seller' && id2[0]=='category'){
            get_json(baseurl + 'allcountries',function(val){
                data['countryData']=val;
                if(val.length > 0){
                    get_json(baseurl + 'allcategories',function(vals){
                        data['categoryData']=vals;
                        if(vals.length > 0){
                            get_json(baseurl+'filterbySelCat'+'/'+id1[1]+'/'+id2[1],function(result){
                                data['productData']=result;
                                if(result.length>0){
                                    get_json(baseurl+ 'getAllcurrency/',function(resp){
                                        data['currencyList']=resp;
                                        console.log('Data is rendered!');
                                        res.render('products1.html', data);

                                    });
                                }
                            });
                        }
                    });
                }
            });

        }
      console.log('2 param in url');

    }else if(urlpart.length==3){

         var urlparams = parts[1];

         var urlpart = urlparams.split('&');

         var id1 = urlpart[0].split('=');
         var id2 = urlpart[1].split('=');
         var id3 = urlpart[2].split('=');

         if (id1[0]=='country' && id2[0]=='category' && id3[0]=='subcategory')  {
            get_json(baseurl + 'allcountries',function(val){
                console.log('country category subcategory api call');
                data['countryData']=val;
                if(val.length > 0){
                    get_json(baseurl + 'allcategories',function(vals){
                        data['categoryData']=vals;
                        if(vals.length > 0){
                            get_json(baseurl+'filterbyall'+'/'+id1[1]+'/'+id2[1]+'/'+id3[1],function(result){
                                data['productData']=result;
                                if(result.length>0){
                                    get_json(baseurl+ 'getAllcurrency/',function(resp){
                                        data['currencyList']=resp;
                                        console.log('Data is rendered!');
                                        res.render('products1.html', data);

                                    });
                                }
                            });
                        }
                    });
                }
            });

        }  if (id1[0]=='seller' && id2[0]=='category' && id3[0]=='subcategory')
        {

            get_json(baseurl + 'allcountries',function(val){
                data['countryData']=val;
                if(val.length > 0){
                    get_json(baseurl + 'allcategories',function(vals){
                        data['categoryData']=vals;
                        if(vals.length > 0){
                            get_json(baseurl+'filterallbyseller'+'/'+id1[1]+'/'+id2[1]+'/'+id3[1],function(result){
                                data['productData']=result;
                                if(result.length>0){
                                    get_json(baseurl+ 'getAllcurrency/',function(resp){
                                        data['currencyList']=resp;
                                        console.log('Data is rendered!');
                                        res.render('products1.html', data);

                                    });
                                }

                            });
                        }
                    });
                }
            });
        }
        console.log('3 param in url');

    }
   }else{
        console.log('product page');
         get_json(baseurl + 'allcountries',function(val){
            data['countryData']=val;
            if(val.length > 0){
                get_json(baseurl + 'allcategories',function(vals){
                    data['categoryData']=vals;
                    if(vals.length > 0){
                        get_json(baseurl + 'allproducts',function(result){
                            data['productData']=result;
                            console.log('data is rendered for product1.html page');
                            console.log(data);
                            res.render('products1.html', data);
                        });
                    }
                });
            }
        });
    }

};
