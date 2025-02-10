const express = require("express");
const router = express.Router();
const Listings = require("../models/listings");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn,isOwner,validateListing } = require("../middleware");




//get all listings 

router.get("/", wrapAsync(async (req, res) => {
    let allListings = await Listings.find({});
    res.render("listings/index.ejs", { allListings });
}));


router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
})

//get all listings by id

router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listings.findById(id).populate("reviews").populate("owner");
    if (!listing) {
        req.flash("error", "Your listings doens't exists");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));




//add new listings


router.post("/", validateListing, wrapAsync(async (req, res, next) => {

    const newListing = new Listings(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");

}));





//edit listings

router.get("/:id/edit", isLoggedIn, isOwner,
    wrapAsync(async (req, res) => {

        let { id } = req.params;
        const listing = await Listings.findById(id);
        res.render("listings/edit.ejs", { listing });

    }))


//Update Route

router.put("/:id", isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync
        (async (req, res) => {

            let { id } = req.params;
            await Listings.findByIdAndUpdate(id, { ...req.body.listing });
            req.flash("success", "Listing Updated Successfully");
            res.redirect("/listings");

        }))




//Delete Request

router.delete("/:id", isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deltedListing = await Listings.findByIdAndDelete(id);
    console.log(deltedListing);
    req.flash("success", "Listing Deleted Successfully");
    res.redirect("/listings");
}));


module.exports = router;