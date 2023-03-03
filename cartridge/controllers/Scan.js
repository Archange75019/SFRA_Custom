var page = module.superModule;
var server = require('server');

var cache = require('*/cartridge/scripts/middleware/cache');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
var pageMetaData = require('*/cartridge/scripts/middleware/pageMetaData');


 server.get(
    'Show',
    server.middleware.https,
    consentTracking.consent,
    function (req, res, next) {
        res.render('scan');
        next();
    }
);

server.post(
    'Search',
    server.middleware.https,
    consentTracking.consent,
    function (req, res, next) {  
        var URLUtils = require('dw/web/URLUtils');
        var product = JSON.parse(req.body).EAN;
        var ProductSearchModel = require('dw/catalog/ProductSearchModel');
        
        var apiProductSearch = new ProductSearchModel();
        apiProductSearch.addRefinementValues('EAN', product);
        apiProductSearch.search();
        var hits = apiProductSearch.productSearchHits;
        var productId =null; 

        while(hits.hasNext()){
        var productHit = hits.next();
            if(productHit.product.EAN == product){
             productId = productHit.product.ID;
            break;
            }
        }
        if(productId){
            var productShowUrl =URLUtils.url('Product-Show','pid',productId).toString();
            res.json({
                error: false,
                redirectUrl :productShowUrl
            });

        } else {
            res.json({
                error: true,
                message : 'Produit à définir'
            });
        }
        next();
        
})
module.exports = server.exports();