var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  name: String,
  userId: { type: String, required: true, unique: true },
  role: String,
  created_at: Date,
  updated_at: Date
});


userSchema.statics.findOrCreate = function findOrCreate(profile, cb){
    var userObj = new this();
    this.findOne({userId : profile.id},function(err,result){ 
        if(!result){
            userObj.name = profile.displayName;
            userObj.userId = profile.id;
            userObj.role = "default";
            userObj.created_at = Date();
            userObj.updated_at = Date();
            userObj.save(cb);
        }else{
            cb(err,result);
        }
    });
};
// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('users', userSchema);

// make this available in our Node applications
module.exports = User;