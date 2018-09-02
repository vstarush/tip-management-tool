var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var Invoice    = require('../models/invoiceModel');
var moment = require('moment');
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

var db = mongojs('mongodb://'+connection_string, ['invoices']);

/* GET All Invoices */
router.get('/invoices', function(req, res, next) {
    db.invoices.find({
        userId:req.user._id
    },function(err, invoices) {
        if (err) {
            res.send(err);
        } else {
            res.json(invoices);
        }
    });
});

/* GET One Invoice for the provided date */
router.get('/invoice/:date', function(req, res, next) {
    var invoceDate = moment(req.params.date,"MM-DD-YYYY").format("ddd MM/DD/YYYY");
    console.log(invoceDate);
    db.invoices.findOne({
        date: invoceDate, userId:req.user._id
    }, function(err, invoices) {
        if (err) {
            res.send(err);
        } else {
            res.json(invoices);
        }
    });
});//

/* GET array of Invoice for the provided range of dates */
router.get('/invoice-range/:daterange', function(req, res, next) {
    var range = req.params.daterange.split(":");
    var startDate = new Date(range[0]).getTime();
    var endDate = new Date(range[1]).getTime();
    //db.invoices.find( { $where : "this.dateTime >= "+startDate+" && this.dateTime <= "+endDate+" && this.userId == "+req.user._id }
    // db.invoices.findOne({
     db.invoices.find({ "userId" : req.user._id , 
                "dateTime" : { "$lte" : endDate , 
                                "$gte" : startDate}}
     , function(err, invoices) {
        if (err) {
            res.send(err);
        } else {
            res.json(invoices);
        }
    });
});

/* POST/SAVE a Invoice */
router.post('/invoice', function(req, res, next) {
    var invoice = req.body; 
        if(req.user){
            invoice["userId"] = req.user._id;
        }
    Invoice.saveOrUpdate(invoice , function(err, _invoice) {
        if (err) {
            res.status(400);
            res.json({
                "error": "DB error (invoice)"
            });
        }
        res.json(_invoice);
    });
});


/* DELETE an Invoice */
router.delete('/invoice/:id', function(req, res) {
    db.invoices.remove({
        _id: mongojs.ObjectId(req.params.id)
    }, '', function(err, result) {
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }
    });

});

module.exports = router;