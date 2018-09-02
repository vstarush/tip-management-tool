var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var invoiceSchema = new Schema({
  date: String,
  dateTime: Number,
  netDeposit: Number,
  declaredTips: Number,
  laborHours: Number,
  bonus: Number,
  payout: Number,
  totalTipOut:Number,
  afterTipOut: Number,
  afterTipOutWithBonus:Number,
  userId: String,
  bar: { 
       numberOfWorkers:Number,
       totalShare:Number,
       defaultHours:Number,
       nameOfDepartment:String,
       employeesList:[{
            hours:Number,
            tipsShare:Number,
            name:String,
       }],
  },
  foodRunners: { 
       numberOfWorkers:Number,
       totalShare:Number,
       defaultHours:Number,
       nameOfDepartment:String,
       employeesList:[{
            hours:Number,
            tipsShare:Number,
            name:String
       }],
  },
  kitchen: { 
       numberOfWorkers:Number,
       totalShare:Number,
       defaultHours:Number,
       nameOfDepartment:String,
       employeesList:[{
            hours:Number,
            tipsShare:Number,
            name:String
       }],
  },
  created_at: Date,
  updated_at: Date
});

invoiceSchema.statics.saveOrUpdate = function (invoice, cb){
    var invoiceObj = new this();
    this.findOne({date : invoice.date, userId : invoice.userId},function(err,result){ 
        if(!result){
            // create new invoice in db
            JsonToMongoObj(invoice,invoiceObj);
            invoiceObj.save(cb);
        }else{
            // update invoice in db
            JsonToMongoObj(invoice,result);
            result.save(cb);
        }
    });
};


// the schema is useless so far
// we need to create a model using it
var Invoice = mongoose.model('invoices', invoiceSchema);

// make this available in our Node applications
module.exports = Invoice;

function JsonToMongoObj(jsonData,mongObj){
    for (var propName in jsonData) {
        mongObj[propName] = jsonData[propName];
    }
}
