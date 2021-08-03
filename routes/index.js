const express = require('express');
const Book = require('../models/book.js')

const router = express.Router();

router.get('/', async (req, res)=>{
    try{    
        let books = await Book.find().sort({createdAt: 'desc'}).limit(10).exec()
        res.render('index.ejs', {books})
    }catch{
        console.log("error")
    }
})

module.exports = router;