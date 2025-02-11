const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn,isOwner,validateListing } = require("../middleware");
const {index, renderNewForm, showListings, createListings, renderEditForm, updateListings, deleteListings} = require("../controllers/listings");
const multer = require('multer') ;
const {storage} = require("../cloudinaryConfig");
const upload = multer({storage});

router.
    route("/")
    .get(wrapAsync(index))
    .post(isLoggedIn,
        upload.single('listing[image]'),
        validateListing, 
        wrapAsync(createListings)
);
   


router.get("/new", isLoggedIn, renderNewForm);

router.
route("/:id")
 .get(wrapAsync(showListings))
 .put(isLoggedIn,isOwner, upload.single('listing[image]'),validateListing,wrapAsync(updateListings))
 .delete(isLoggedIn,isOwner, wrapAsync(deleteListings));



router.get("/:id/edit", isLoggedIn, isOwner,wrapAsync(renderEditForm));



module.exports = router;