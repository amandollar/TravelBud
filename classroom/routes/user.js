const express = require("express");
const router = express.Router();


//Users

//get user
router.get("/",(req,res)=>{
    res.send("GET for users");
})


//show - users
router.get("/:id",(req,res)=>{
    res.send("GET for show users with id");
})

//post users

router.post("/",(req,res)=>{
    res.send("POST for user");
})


//delete user
router.delete("/:id",(req,res)=>{
    res.send("Detete for users");
})


module.exports = router;