const mongoose = require("mongoose");



const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2024/09/15/21/50/house-plans-9050076_640.png",
        set:(v) => v == ""?"https://cdn.pixabay.com/photo/2024/09/15/21/50/house-plans-9050076_640.png":v

    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    }
})

const Listings = mongoose.model("listings",listingSchema);

module.exports  = Listings;