var express               = require('express');
var router                = express.Router();
var path                  = require('path');
var passport              = require('passport');
var User                  = require('../models/userModel');
var mongoose              = require('mongoose');

//////////////////////////////////////////////////////////////////// 
// To make openshit mongoDb accessable from localHost type in console:
// rhc port-forward taproom --namespace juvik
// 
//To connect to a service running on OpenShift, use the Local address
// Service Local                OpenShift
// ------- --------------- ---- -------------------
// httpd   127.0.0.1:8080   =>  127.2.228.131:8080
// mongodb 127.0.0.1:27017  =>  127.2.228.130:27017
// node    127.0.0.1:8081   =>  127.2.228.129:8080
// node    127.0.0.1:5000   =>  *:5000
////////////////////////////////////////////////////////////////////
var connection_string = 'admin:mwl7wBCSZLIN@127.0.0.1:27017/taproom';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

var connect = function () {
    mongoose.connect('mongodb://'+connection_string);
};
connect();

var db = mongoose.connection;

db.on('error', function(error){
    console.log("Error loading the db - "+ error);
});

db.on('disconnected', connect);

/**
 * Authorization route for facebook provider
 */
router.get('/authorize/facebook',
  passport.authenticate('facebook')
);
/**
 * Callback route for facebook provider
 */
router.get('/callback/facebook', function(req, res, next) {
  passport.authenticate('facebook', function(err, user, info) {
      console.log("passport.authenticate('facebook')");
    if (err) { 
         //TODO: Err after passport authentication
        return next(err); 
    }
    if (!user) { 
        //TODO: No user after passport authentication
        console.log('/login');
        // return res.redirect('/login');
     }
     //after req.login() req.user -- will show user info with every request
     req.login(user, function(err) {
      if (err) { 
          //TODO: Err after passport login
          return next(err);
      }
      return res.redirect('/?userName=' + user.name + '&userRole=' + user.role);
    });
  })(req, res, next);
});

/* Logout from session */
router.get('/authorize/logout', function(req, res){
    console.log('logout');
    req.logout();
    res.redirect("/");
});

/* GET home page. */
router.get('/', function(req, res, next) {
   res.render('index.html');
});

module.exports = router;