const express = require("express");
const router = express.Router({mergeParams:true});
const Listings = require("../models/listings");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const {validateReview} = require("../middleware");








//Review 
//Post Route

router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let { id } = req.params;
    const listing = await Listings.findById(id);
    let newReview = new Review(req.body.review);
 
    listing.reviews.push(newReview);
 
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created");
    res.redirect(`/listings/${listing._id}`);
 
 }))
 
 
 
 //Delete Review Route
 
 
 router.delete("/:reviewId",
     wrapAsync(async(req,res)=>{
         let {id,reviewId} = req.params;
 
         await Listings.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
         await Review.findByIdAndDelete(reviewId);
         req.flash("success","Review Deleted Successfully");
         res.redirect(`/listings/${id}`)
 
 }))
 
 
 module.exports = router;