const express = require("express")
const morgan = require('morgan')
const createError = require('http-errors')
const xssClean = require('xss-clean')
const rateLimit = require('express-rate-limit')
const bodyParser = require('body-parser')

const app = express();


const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, 
    max:5,
    message:"Too many request from this ip. Please try again later",
})

app.use(limiter);
app.use(xssClean());
app.use(morgan("dev"));


// Express built in Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// Middleware Function

// const isLoggedIn = (req,res,next)=>{
//     const login = true;
//     if (login) {
//         req.body.id=101;
//         next(); 
//     }else{
//         return res.status(401).json({message:"Please Login first"})
//     }
   
// };

// app.use(isLoggedIn);

app.get("/test",limiter,(req,res)=>{
    res.status(200).send({
        message:"welcome to the server",
    });
});
app.get("/api/user",(req,res)=>{
    console.log("user profile")
    console.log(req.body.id)
    res.status(200).send({
        message:"user profile is returned",
    });
});


// client error handling
app.use((req,res,next)=>{
    next(createError(404, 'Please login to view this page.'))
})
// Server Error Handling
app.use((err, req, res, next) => {
    
   return res.status(err.status || 500 ).json({
    success:false,
    message:err.message,
   })
  })


module.exports = app;