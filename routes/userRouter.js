const express = require('express');
const router = express.Router();
const authMiddleware = require(global.app_root + "/middleware/authenticationMiddleware.js");
const userValidator = require(global.app_root + "/validator/userValidator.js");
const userManager = require(global.app_root + "/service/userManager.js");
const { check, validationResult } = require('express-validator/check');
const models = require('../models');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: false });

router.get('/signup', [authMiddleware.requireNotLogin, csrfProtection], function(req, res, next) {
  var userData = { name: '', email: '' }
  res.render('user/signup', { user: userData, errors: {}, csrfToken: req.csrfToken() });
});

router.post('/signup', [authMiddleware.requireNotLogin, csrfProtection, userValidator.validate], function(req, res, next) {
  var errors = validationResult(req);
  var userData = { name: req.body.name, email: req.body.email, password: req.body.password }
  if(!errors.isEmpty()){
    return res.render('user/signup', { user: userData, errors: errors.array(), csrfToken: req.csrfToken() });
  }
  userManager.createAndLogin(userData, res).then(user => {
    res.redirect('/users/'+user.id);
  }).catch(function(error){
    console.log('Error in siggnup '+error);
    return res.render('user/signup', { user: userData, errors: [{ msg:'Failed to signup'}], csrfToken: req.csrfToken() });   
  });
});

router.get('/:id', [authMiddleware.requireLogin], function(req, res, next) {
  if(req.params.id == req.user.id) {
    return res.render('user/detail', { user: req.user });
  }
  next();
});

module.exports = router;
