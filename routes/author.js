
const express = require('express')
const router = express.Router()
const Author = require('../models/author.js')
const Book = require('../models/book.js')

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
        res.redirect(`/authors/${author.id}`);
    }catch{
        res.render('authors/new.ejs', {
            author: author,
            errorMessage: 'failed to create author'
        })
    }
})

router.get('/:id', async (req, res)=>{
    try{
        let author = await Author.findById(req.params.id)

        let books = await Book.find({author: author.id}).limit(5).exec()
        res.render('authors/detail.ejs', {
            author,
            books
        })
    }catch{
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res)=>{
    try{
        let author = await Author.findById(req.params.id)
        res.render('authors/edit.ejs', {author})
    }catch{
        res.redirect('/authors')
    }
})

router.put('/:id', async (req, res)=>{

    let author
    try{
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    }catch{
        if(author == null) redirect('/')
        else{
            res.render('authors/edit.ejs', {
                author, 
                errorMessage: "error editing author"
            })
        }
    }
})
router.delete('/:id', async (req, res)=>{
    let author
    try{
        author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect(`/authors`)
    }catch{
        if(author == null) redirect('/')
        else{
            res.redirect(`/authors/${author.id}`)
        }
    }
})

module.exports = router