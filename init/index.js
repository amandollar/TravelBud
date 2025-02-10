const mongoose = require("mongoose");
const initData = require('./data.js');
const Listings = require('../models/listings.js');



const URI = "mongodb://localhost:27017/travelbud";


main().then(() => {
    console.log("Mongodb connected");
}).catch((err) => {
    console.log(err);
});

async function main(params) {
    await mongoose.connect(URI);
}


const initDb = async()=>{
    await Listings.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:"67a7b3cf59de711cd25dd574"}));
    await Listings.insertMany(initData.data);
    console.log("Data was intialized");
}

initDb();