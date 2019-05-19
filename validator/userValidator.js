const {check} = require('express-validator/check')
const models = require(global.app_root + '/models');
const userManager = require(global.app_root + "/service/userManager.js");

const validate = [
    check('name').isString(),
    check('name').isLength({ max: 30 }),
    check('email').isEmail(),
    check('email').isLength({ max: 255 }),
    check('email').custom(email => {
        return userManager.isExistEmail(email).then(isEsixtEmail => {
            if(isEsixtEmail){
                return Promise.reject('E-mail already in use');
            }  
        })
     }),
    check('password').isLength({ min: 7 , max: 128 }).withMessage('Password must least 7 characters'),
    check('password').isAlphanumeric()
];

module.exports.validate = validate;

