const Listings = require("../models/listings");


module.exports.index = async (req, res) => {
    let searchQuery = req.query.search;
    let allListings = searchQuery?
    await Listings.find({title:{$regex:searchQuery,$options: 'i'}})
    : await Listings.find({});

    res.render("listings/index.ejs", { allListings });
}



module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}


module.exports.showListings = async (req, res) => {
    let { id } = req.params;
    const listing = await Listings.findById(id).
        populate({
            path: "reviews",
            populate: {
                path: "author"
            },
        })
        .populate("owner");


    if (!listing) {
        req.flash("error", "Your listings doens't exists");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}


module.exports.createListings = async (req, res) => {

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listings(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");

}


module.exports.renderEditForm = async (req, res) => {

    let { id } = req.params;
    const listing = await Listings.findById(id);
    res.render("listings/edit.ejs", { listing });

}

module.exports.updateListings = async (req, res) => {

    let { id } = req.params;
    let listings = await Listings.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listings.image = { url, filename };
        await listings.save();
    
    }

    req.flash("success", "Listing Updated Successfully");
    res.redirect("/listings");

}



module.exports.deleteListings = async (req, res) => {
    let { id } = req.params;
    let deltedListing = await Listings.findByIdAndDelete(id);
    console.log(deltedListing);
    req.flash("success", "Listing Deleted Successfully");
    res.redirect("/listings");
}