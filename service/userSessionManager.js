const Redis = require('ioredis');
const redis = new Redis(6379, 'redis');

const USER_TOKEN_COOKIE_NAME = 'auth_token';
const SESSION_EXPIRE_SECONDS = 60 * 60 * 24 * 30; // 1 month

const fetchSession = async function (req) {
    let fetchSuccess = false;
    var token = req.cookies.auth_token;
    if(token !== undefined){
        await redis.get(getKey(token), function (err, result) {
            req.user = JSON.parse(result);
            fetchSuccess = true;
        });
    }
    return fetchSuccess;
}

const setSession = async function (res, token, data){
    redis.set(getKey(token), JSON.stringify(data), 'EX', SESSION_EXPIRE_SECONDS);
    await res.cookie(USER_TOKEN_COOKIE_NAME, token,  { maxAge:SESSION_EXPIRE_SECONDS, httpOnly:false });
}

const deleteSession = async function(req, res){
    var token = req.cookies.USER_TOKEN_COOKIE_NAME;
    res.clearCookie(USER_TOKEN_COOKIE_NAME);
    await redis.del(getKey(token));
}

const getKey = function (token){
    return USER_TOKEN_COOKIE_NAME + ':' + token;
}

module.exports.fetchSession = fetchSession;
module.exports.setSession = setSession;
module.exports.deleteSession = deleteSession;