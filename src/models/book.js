const mongoose = require('mongoose');
const ShortUniqueId = require('short-unique-id');

const uid = new ShortUniqueId({ length: 5 });

const BookSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uid.rnd(),
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    ISBN: {
        type: String,
        default: ""
    },
    pages: {
        type: Number
    },
    publisher: {
        type: String
    },
    language: {
        type: String
    },
});

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;