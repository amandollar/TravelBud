const express = require("express");
const users = require("./routes/user");
const posts = require("./routes/post");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");


const sessionOption = {
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(session(sessionOption));
app.use(flash());


app.get("/register",(req,res)=>{
    let {name ="anoy"} = req.query;
    req.session.name = name;
    req.flash("success","user registered successfully");
    res.redirect("/greet");
})



app.get("/greet",(req,res)=>{
    
    res.locals.messages = req.flash("success");
    res.render("page.ejs",{name:req.session.name});
})











app.listen(3000,()=>{
    console.log("App listening on port 3000");
})