const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listings = require("./models/listings");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");



const URI = "mongodb://localhost:27017/travelbud";


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))


main().then(() => {
    console.log("Mongodb connected");
}).catch((err) => {
    console.log(err);
});

async function main(params) {
    await mongoose.connect(URI);
}



app.get("/",(req,res)=>{
    res.send("Root");
})


//get all listings 

app.get("/listings",async(req,res)=>{
    let allListings = await Listings.find({});
    res.render("listings/index.ejs",{allListings});
})


app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//get all listings by id

app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    const listing = await Listings.findById(id);
    res.render("listings/show.ejs",{listing});
})




//add new listings


app.post("/listings",async(req,res)=>{

    const newListing =  new Listings(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})





//edit listings

app.get("/listings/:id/edit",async(req,res)=>{
    let {id} = req.params;
    const listing = await Listings.findById(id);
    res.render("listings/edit.ejs",{listing});
})


app.put("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    await Listings.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
})




//Delete Request

app.delete("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    let deltedListing = await Listings.findByIdAndDelete(id);
    console.log(deltedListing);
    res.redirect("/listings");
})


app.listen("8080",()=>{
    console.log("Server listening on  port 8080");
})
