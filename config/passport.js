/**
 * Configure all Passport login here so we don't have to keep it in server.js
 */

/**
 * Import modules
 */
var User            = require('../models/userModel');
var passport        = require('passport');
var FacebookStrategy  = require('passport-facebook').Strategy;
 
/**
 * These can be (may be in the future) more complex
 * if need be. Depends on how you are handling authentication
 * and serialization
 */
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var callbackURL ="http://localhost:3000/callback/facebook";// "http://taproom-juvik.rhcloud.com/callback/facebook";//
passport.use(new FacebookStrategy({
    clientID: "1621898574716044",
    clientSecret: "2ba02f706dbd08aec81f23e1b1951685",
    callbackURL: callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate(profile , function(err, user) {
        if (err) {
            return done(err); 
        }
        done(null, user);
    });
  }
));
