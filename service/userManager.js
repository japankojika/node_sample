const crypto = require('crypto');
const models = require(global.app_root + '/models');
const userSessionManager = require(global.app_root + "/service/userSessionManager.js");

const EMAIL_HASH_ALGRITHM = 'aes-192-cbc';
const EMAIL_HASH_KEY = 'wrboavrsg';
const PASSWORD_ENCRYPT_ALGRITHM = 'sha256';
const PASSWORD_ENCRYPT_KEY = 'egeegvaerg';
const SESSION_TOKEN_ALGRITHM = 'sha1';
const SESSION_TOKEN_KEY = 'AOefergdcdce';

const createAndLogin = async function(userData, res) {
    let salt = crypto.randomBytes(20).toString('hex');
    let registData = {
        name: userData.name,
        email: creatHashedEmail(userData.email),
        encrypted_password: createEncryptedPassword(userData.password)
    }
    let user = await models.User.create(registData);
    await setSession(res, user);
    return user;
}

const login = async function(email, password, res) {
    let user = await models.User.findOne({ where: { email: creatHashedEmail(email), encrypted_password: createEncryptedPassword(password) }});
    if(user === null){
        return null;
    } else {
        await setSession(res, user);
        return user.id;    
    }
}

const setSession = async function(res, user){
    const token = createSessionToken(user.id);
    await userSessionManager.setSession(res, token, { id: user.id, name: user.name });    
}

const creatHashedEmail = function(email){
    let cipher = crypto.createCipher(EMAIL_HASH_ALGRITHM, EMAIL_HASH_KEY)
    let crypted = cipher.update(email, 'utf8', 'hex')
    return crypted += cipher.final('hex');
}

const createEncryptedPassword = function(password){
    return crypto.createHmac(PASSWORD_ENCRYPT_ALGRITHM, PASSWORD_ENCRYPT_KEY)
                 .update(password)
                 .digest('hex');
}

const createSessionToken = function (userId){
    let tokenKey = userId + ':' + Math.floor(new Date() / 1000);
    return crypto.createHmac(SESSION_TOKEN_ALGRITHM, SESSION_TOKEN_KEY)
                 .update(tokenKey)
                 .digest('hex');
}

const isExistEmail = async function(email){
    let reuslt = await models.User.findAndCountAll({ where: { email: creatHashedEmail(email)}});
    return reuslt.count !== 0;    
}

module.exports.createAndLogin = createAndLogin;
module.exports.login = login;
module.exports.isExistEmail = isExistEmail;