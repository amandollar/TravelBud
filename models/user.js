const mongoose = require("mongoose");
let {Schema} = mongoose;
const passsportLocalMonoogse = require("passport-local-mongoose");


const userSchema = new Schema({
    email:{
        type:String,
        required:true
    }

});


userSchema.plugin(passsportLocalMonoogse);

module.exports = mongoose.model("User",userSchema);