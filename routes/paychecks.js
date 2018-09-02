var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var Paychecks = require('../models/paychecksModel');
var moment = require('moment');

var connection_string = 'admin:mwl7wBCSZLIN@127.0.0.1:27017/taproom';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

var db = mongojs('mongodb://'+connection_string, ['paychecks']);

/* GET list of paychecks dates */
router.get('/paychecks', function(req, res, next) {
    db.paychecks.findOne({
        userId:req.user._id
    },function(err, paychecks) {
        if (err) {
            res.send(err);
        } else {
            res.json(paychecks);
        }
    });
});


/* POST/SAVE list of paychecks  */
router.post('/paychecks', function(req, res, next) {
    var paychecks = req.body; 
        if(req.user){
            paychecks["userId"] = req.user._id;
        }
    Paychecks.saveOrUpdate(paychecks , function(err, _paychecks) {
        if (err) {
            res.status(400);
            res.json({
                "error": "DB error (paychecks)"
            });
        }
        res.json(_paychecks);
    });
    
  
});

module.exports = router;