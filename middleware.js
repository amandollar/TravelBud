const Listings = require("./models/listings");
const ExpressError = require("./utils/ExpressError");
const { listingSchema } = require("./schema");
const {reivewSchema} = require("./schema");
const Review = require("./models/review");

module.exports.isLoggedIn = (req,res,next)=>{
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create listings");
        return res.redirect("/login");
    }

    next();
}


module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
}


module.exports.isOwner = async(req,res,next) =>{
    let {id} = req.params;
    let listing = await Listings.findById(id)
    if(!listing.owner.equals(res.locals.CurrUser._id)){
        req.flash("error","You don't have permmission");
        return res.redirect(`/listings/${id}`);
    }

    next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message.join(","));
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}


module.exports.validateReview = (req,res,next)=>{
    let {error} = reivewSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details.map((el)=>el.message.join(","));
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}


module.exports.isReviewAuthor = async(req,res,next) =>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId)
    if(!review.author.equals(res.locals.CurrUser._id)){
        
        req.flash("error","You don't have permmission");
        return res.redirect(`/listings/${id}`);
       
    }
        
    next();
    

    
}