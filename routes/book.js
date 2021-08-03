const express = require('express')
const Author = require('../models/author.js')
const Book = require('../models/book.js')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const router = express.Router()

const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
const uploadPath = path.join('public', Book.coverImageBasePath)
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback)=>{
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})
// index
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
router.post('/', upload.single('cover'), async (req, res)=>{
    const fileName = req.file!= null? req.file.filename: null
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: req.body.publishDate,
        pageCount: req.body.pageCount,
        coverImg: fileName,
        description: req.body.description
    })
    try{
        const newBook = await book.save()
        res.redirect('/books')
    }catch{
        renderNewPage(res, book, true)
        if(book.coverImg != null) removeBookCover(book.coverImg)
    }
})

function removeBookCover(fileName){
    fs.unlink(path.join(uploadPath, fileName), (err)=>{
        if(err) console.log(err)
    })
}

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
module.exports = router