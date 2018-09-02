var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var mongoose = require('mongoose');

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

var db = mongojs('mongodb://'+connection_string, ['users']);

// mongoose.connect('mongodb://localhost/test');

/* GET All users */
router.get('/users', function(req, res, next) {
    db.users.find(function(err, users) {
        if (err) {
            //console.log(err);
            res.send(err);
        } else {
            //console.log(users);
            res.json(users);
        }
    });
});

router.get('/currentuser', function(req, res, next) {
    if(!req.user){
        res.send("there is no current user session");
    }else{
        res.json(req.user);
    }
});

/* GET One user with the provided ID */
router.get('/user/:id', function(req, res, next) {
    db.users.findOne({
        _id: mongojs.ObjectId(req.params.id)
    }, function(err, users) {
        if (err) {
            res.send(err);
        } else {
            res.json(users);
        }
    });
});

/* POST/SAVE a user */
router.post('/user', function(req, res, next) {
    var user = req.body;
    if (!user.text || !(user.isCompleted + '')) {
        res.status(400);
        res.json({
            "error": "Invalid Data"
        });
    } else {
        db.users.save(user, function(err, result) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        })
    }
});

/* PUT/UPDATE an user */
router.put('/user/:id', function(req, res, next) {
    var user = req.body;
    var updObj = {};

    if (user.isCompleted) {
        updObj.isCompleted = user.isCompleted;
    }
    if (user.text) {
        updObj.text = user.text;
    }

    if (!updObj) {
        res.status(400);
        res.json({
            "error": "Invalid Data"
        });
    } else {
        db.users.update({
            _id: mongojs.ObjectId(req.params.id)
        }, updObj, {}, function(err, result) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        });
    }


});

/* DELETE an user */
router.delete('/user/:id', function(req, res) {
    db.users.remove({
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