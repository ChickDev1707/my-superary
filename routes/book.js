const express = require('express')
const Author = require('../models/author.js')
const Book = require('../models/book.js')

const router = express.Router()

const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']

router.get('/', async (req, res)=>{
    try{
        var query = Book.find()
        if(req.query.title!= '' && req.query.title!= null){
            query.regex('title', new RegExp(req.query.title, 'i'))
        }
        if(req.query.after!= '' && req.query.after!= null){
            query.gte('publishDate', req.query.after)
        }
        if(req.query.before!= '' && req.query.before!= null){
            query.lte('publishDate', req.query.before)
        }
        const books = await query.exec()
        res.render('books/index.ejs', {books})
    }catch{
        res.redirect('/')
    }
})

// new book page
router.get('/new', async (req, res)=>{
    renderNewPage(res, new Book())
})

// create new book
router.post('/', async (req, res)=>{
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: req.body.publishDate,
        pageCount: req.body.pageCount,
        description: req.body.description
    })
    saveCover(book, req.body.cover)
    console.log(req.body.cover)

    try{
        const newBook = await book.save()
        res.redirect('/books')
    }catch{
        renderNewPage(res, book, true)
    }
})
 
async function renderNewPage(res, book, hasError = false){
    try{
        const book = new Book()
        const authors = await Author.find({})
        const params = {
            authors, 
            book
        }
        if(hasError) params.errorMessage = "error creating new book"
        res.render('books/new.ejs', params)
    }catch{
        res.redirect('/books')
    }
}
function saveCover(book, coverEncoded){
    if(coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if(cover!= null && imageMimeTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}
module.exports = router