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
    renderFormPage(res, new Book(), 'new')
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

    try{
        const newBook = await book.save()
        res.redirect('/books')
    }catch{
        renderFormPage(res, book, 'new', true)
    }
})

router.get('/:id', async (req, res)=>{
    try{
        let book = await Book.findById(req.params.id).populate('author').exec()
        res.render('books/detail.ejs', {book})
    }catch{
        res.redirect('/')
    }
})
router.get('/:id/edit', async (req, res)=>{
    try{
        const book = await Book.findById(req.params.id)
        renderFormPage(res, book, 'edit')
    }catch{
        res.redirect('/')
    }
})
// update book
router.put('/:id', async (req, res)=>{
    let book
    
    try{
        book = await Book.findById(req.params.id)
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description
        
        if(req.body.cover != null && req.body.cover!= ''){
            saveCover(book, req.body.cover)
        }
        await book.save()

        res.redirect(`/books/${book.id}`)
    }catch (err){
        console.log(err)
        if(book!= null){
            renderFormPage(res, book, 'edit', true)
        }else{
            res.redirect('/')
        }
    }
}) 
router.delete('/:id', async (req, res)=>{
    let book
    try{
        book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect('/books')
    }catch{
        if(book != null){
            res.render('books/detail', {
                errorMessage: "error when deleting book"
            })
        }else res.redirect('/')
    }
}) 

async function renderFormPage(res, book, form, hasError = false){
    try{
        const authors = await Author.find({})
        const params = {
            authors, 
            book
        }
        if(hasError) params.errorMessage = "You have an error"
        res.render(`books/${form}.ejs`, params)
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