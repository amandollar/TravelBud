const express = require("express");
const router = express.Router();



//POSTS

//get - posts
router.get("/",(req,res)=>{
    res.send("GET for posts");
})


//show - posts
router.get("/:id",(req,res)=>{
    res.send("GET for show posts with id");
})


//post posts

router.post("/",(req,res)=>{
    res.send("POST for user");
})


//delete user
router.delete("/:id",(req,res)=>{
    res.send("Detete for posts");
})




module.exports = router;








