const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listings = require("./models/listings");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const {listingSchema} = require("./schema");



const URI = "mongodb://localhost:27017/travelbud";


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")))


main().then(() => {
    console.log("Mongodb connected");
}).catch((err) => {
    console.log(err);
});

async function main(params) {
    await mongoose.connect(URI);
}



app.get("/", (req, res) => {
    res.send("Root");
})


const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details.map((el)=>el.message.join(","));
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}


//get all listings 

app.get("/listings", wrapAsync(async (req, res) => {
    let allListings = await Listings.find({});
    res.render("listings/index.ejs", { allListings });
}));


app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})

//get all listings by id

app.get("/listings/:id",wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listings.findById(id);
    res.render("listings/show.ejs", { listing });
}));




//add new listings


app.post("/listings", validateListing,wrapAsync(async (req, res, next) => {
    
    const newListing = new Listings(req.body.listing);
    await newListing.save();
    res.redirect("/listings");   

}));





//edit listings

app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    
    let { id } = req.params;
    const listing = await Listings.findById(id);
    res.render("listings/edit.ejs", { listing });

}))


//Update Route

app.put("/listings/:id",validateListing, wrapAsync(async (req, res) => {
    
    let { id } = req.params;
    await Listings.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");

}))




//Delete Request

app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deltedListing = await Listings.findByIdAndDelete(id);
    console.log(deltedListing);
    res.redirect("/listings");
}));



app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found"));
})


app.use((err, req, res, next) => {
   let {status = 500,message = "Something went wrong"} = err;
   res.render("error.ejs",{message});

})

app.listen("8050", () => {
    console.log("Server listening on  port 8050");
})
