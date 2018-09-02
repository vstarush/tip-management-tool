var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/////////////////////////
// paychecksSchema - it's a 
////////////////////////
// create a schema
var paychecksSchema = new Schema({
  userId: String,
  dateRanges: [{
            startDate:Date,
            endDate:Date
       }],
  created_at: Date,
  updated_at: Date
});

paychecksSchema.statics.saveOrUpdate = function (paychecks, cb){
    var paychecksObj = new this();
    this.findOne({ userId : paychecks.userId },function(err,result){ 
        if(!result){
            // create new paychecks in db
            JsonToMongoObj(paychecks,paychecksObj);
            paychecksObj.updated_at = new Date();
            paychecksObj.created_at = new Date();
            paychecksObj.save(cb);
        }else{
            // update paychecks in db
            JsonToMongoObj(paychecks,result);
            result.updated_at = new Date();
            result.save(cb);
        }
    });
};


// the schema is useless so far
// we need to create a model using it
var Paychecks = mongoose.model('paychecks', paychecksSchema);

// make this available in our Node applications
module.exports = Paychecks;

function JsonToMongoObj(jsonData,mongObj){
    for (var propName in jsonData) {
        mongObj[propName] = jsonData[propName];
    }
}