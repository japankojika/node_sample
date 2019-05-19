const userSessionManager = require(global.app_root + "/service/userSessionManager.js");

const onlyFetch = async function (req, res, next) {
    await userSessionManager.fetchSession(req).then(isSuccess => {
        if(isSuccess){
            res.locals.user = req.user;
        } else {
            res.locals.user = null;
        }
    });
    next();
}

const requireLogin = async function (req, res, next) {
    await userSessionManager.fetchSession(req).then(isSuccess => {
        if(isSuccess){
            next();
        } else {
            var buffer = new Buffer(req.originalUrl, 'ascii');
            var redirectUrlBase64 = buffer.toString('base64');
            res.redirect('/login?redirect=' + redirectUrlBase64); 
        }
    });
}

const requireNotLogin = async function (req, res, next) {
    await userSessionManager.fetchSession(req).then(isSuccess => {
        if(isSuccess){
            res.redirect('/');
        } else {
            next();
        }
    });
}

module.exports.onlyFetch = onlyFetch;
module.exports.requireLogin = requireLogin;
module.exports.requireNotLogin = requireNotLogin;