const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const { createReview, deleteReview } = require("../controllers/review");




router.post("/", isLoggedIn,validateReview,wrapAsync(createReview));
router.delete("/:reviewId", isLoggedIn,isReviewAuthor,wrapAsync(deleteReview))












module.exports = router;