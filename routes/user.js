const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const { singup, renderLogin, renderSignup, login, logout } = require("../controllers/user");



router.route("/signup").
get(renderSignup)
.post(wrapAsync(singup));


router.route("/login")
 .get(renderLogin)
 .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect: '/login',failureFlash: true}),login);


router.get("/logout",logout);




module.exports = router;