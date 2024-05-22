const _ = require('lodash');
const Book = require('../models/book');

const getAllBooks = async function (req, res) {
    const books = await Book.find({}).select('-_id -__v');

    res.status(200).send(books);
    return;
};

const getBook = async function (req, res) {
    const book = await Book.findOne({ id: req.params.id }).select('-_id -__v')

    if (!book) {
        res.status(404).json({
            message: 'Book not found'
        });
        return;
    }
    else {
        res.status(200).send(book);
        return;
    }
};

const createBook = async function (req, res) {
    try {
        let errors = {};
        const { id, title, author, ISBN, pages, publisher, language } = req.body;

        ['title', 'author'].forEach(key => {
            if (req.body[key] === null || req.body[key] === undefined) {
                errors[key] = `${key} is a required parameter`;
            }
            else if (req.body[key] === "") {
                errors[key] = `${key} cannot be empty`;
            }
        });

        if (_.keys(errors).length > 0) {
            res.status(400).json(errors);
            return;
        }

        await Book.findOne({ id: id })
            .then(async (book) => {
                if (book) {
                    res.status(400).json({
                        message: "This book already exists"
                    });
                }
                else {
                    const newBook = new Book({
                        id,
                        title,
                        author,
                        ISBN,
                        pages,
                        publisher,
                        language
                    })

                    await newBook.save();

                    res.status(200).json({
                        id: newBook.id,
                        title: newBook.title,
                        author: newBook.author,
                        ISBN: newBook.ISBN,
                        pages: newBook.pages,
                        publisher: newBook.publisher,
                        language: newBook.language
                    });
                    return;
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
        return;
    }
};

const updateBook = async function (req, res) {

};

const deleteBook = async function (req, res) {
    try {
        await Book.findOneAndDelete({ id: req.params.id })
            .then((deletedBook) => {
                if (deletedBook) {
                    res.status(200).json({
                        success: true,
                        data: {
                            message: "Book deleted successfully."
                        }
                    });
                    return;
                }
                else {
                    res.status(401).json({
                        message: 'This book does not exists.'
                    });
                    return;
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

module.exports = {
    getAllBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook
}