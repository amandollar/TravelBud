const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const { rmSync } = require("fs");




const URI = "mongodb://localhost:27017/travelbud";


main().then(() => {
    console.log("Mongodb connected");
}).catch((err) => {
    console.log(err);
});

async function main(params) {
    await mongoose.connect(URI);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")))



const sessionOptions = {
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}


app.get("/", (req, res) => {
    res.send("Root");
})



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.errors = req.flash("error");
    res.locals.CurrUser = req.user;
    next();
})


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



// app.get("/demouser",async(req,res)=>{
//     let fakerUser = new User({
//         email: "student@gmail.com",
//         username:"amandollar"
//     });

//     let registerredUser = await User.register(fakerUser,"passsword123");
//     res.send(registerredUser);
// })



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
