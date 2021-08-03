
const mongoose = require('mongoose')
const path = require('path')

const coverImageBasePath = 'uploads/bookCovers'

const bookSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    },
    publishDate:{
        type: Date,
        required: true
    },
    pageCount:{
        type: Number,
        required: true
    },
    createAt:{
        type: Date,
        required: true,
        default: Date.now
    },
    coverImg: {
        type: String,
        required: true
    },
    description:{
        type: String,
    }
})
bookSchema.virtual('coverImgPath').get(function(){
    if(this.coverImg!= null){
        return path.join('/', coverImageBasePath, this.coverImg)
    }
})

module.exports = mongoose.model('Book', bookSchema)
module.exports.coverImageBasePath = coverImageBasePath