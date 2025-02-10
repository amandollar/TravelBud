const mongoose = require("mongoose");
let {Schema} = mongoose;
const Review = require("./review");

const listingSchema = new Schema({
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
    },

    reviews:[
        {
        type: Schema.Types.ObjectId,
        ref: "Review"
      }
    ],

    owner: {
        type:Schema.Types.ObjectId,
        ref: 'User'
    }
})

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in: listing.reviews}})
    }
   
})

const Listings = mongoose.model("listings",listingSchema);

module.exports  = Listings;