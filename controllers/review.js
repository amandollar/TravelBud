const Listings = require("../models/listings");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    
    let { id } = req.params;
    const listing = await Listings.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created");
    res.redirect(`/listings/${listing._id}`);

}


module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listings.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted Successfully");
    res.redirect(`/listings/${id}`)

}