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
        var test = req.session
        res.render('listingLives');
        next();
    }
);




module.exports = server.exports();