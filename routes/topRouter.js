const express = require('express');
const router = express.Router();
const authMiddleware = require(global.app_root + "/middleware/authenticationMiddleware.js");
const userManager = require(global.app_root + "/service/userManager.js");
const userSessionManager = require(global.app_root + "/service/userSessionManager.js");
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: false });

router.get('/', [authMiddleware.onlyFetch], function(req, res, next) {
  res.render('top/top', { title: 'Express' });
});

router.get('/login', [authMiddleware.requireNotLogin, csrfProtection], function(req, res, next) {
  res.render('top/login', { email: '', redirectUrl: req.query.redirect, errors: {}, csrfToken: req.csrfToken() });
});

router.post('/login', [authMiddleware.requireNotLogin, csrfProtection], function(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  userManager.login(email, password, res).then(id => {
    if(id === null){
      return res.render('top/login', { email: req.body.email , redirectUrl: req.body.redirectUrl, errors: [{ msg:'Failed to login'}], csrfToken: req.csrfToken() });      
    }
    let redirectUrl = new Buffer(req.body.redirectUrl, 'base64').toString('ascii');
    if(redirectUrl && redirectUrl !== '/logout') {
      return res.redirect(redirectUrl);
    }
    res.redirect('/users/'+id);
  }).catch(function(error){
    console.log('Error in login '+error);
    return res.render('top/login', { email: req.body.email , redirectUrl: req.body.redirectUrl, errors: [{ msg:'Error is happened'}], csrfToken: req.csrfToken() });
  });
});

router.get('/logout', [authMiddleware.requireLogin], function(req, res, next) {
  userSessionManager.deleteSession(req, res).then(data => {
    return res.redirect('/');
  });
});

module.exports = router;
