
const express = require('express')
const router = express.Router()
const Author = require('../models/author.js')

// all authors
router.get('/', async (req, res)=>{

    let searchOptions = {}
    let key = req.query.name
    if(key !== null && key!== '' ){
        searchOptions.name = new RegExp(key, 'i')
    }
    try{
        const authors = await Author.find(searchOptions)
        res.render('authors/index.ejs', {
            authors,
            searchValue: key
        })
    }catch{
        res.redirect('/')
    }
})

// new authors
router.get('/new', (req, res)=>{
    res.render('authors/new.ejs', {
        author: Author(),
    })
})

// create author
router.post('/', async (req, res)=>{
    let author= new Author({
        name: req.body.name
    })

    try{
        const newAuthor = await author.save();
        res.redirect('/authors');
    }catch{
        res.render('authors/new.ejs', {
            author: author,
            errorMessage: 'failed to create author'
        })
    }
})

module.exports = router