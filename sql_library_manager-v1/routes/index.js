var express = require('express');
const db = require('../models');
var router = express.Router();
const Book = require('../models').Book;

function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

function focusInput(){
  let fields = document.querySelectorAll("input");
  fields.forEach(field => {
    console.log(field)
  });
}


/* GET home page. */
router.get('/', asyncHandler(async(req, res) =>
{
      res.redirect("/books");
      const books = await Book.findAll();
      console.log(books);
      res.json(books);
}
  )
);

router.get('/books', asyncHandler(async(req,res) => {
  const books = await Book.findAll()
  res.render('layout', {books})
  }));

router.get('/books/new', asyncHandler(async(req,res) => {
  res.render('new-book', {books:{}})

  // focusInput();
}));

router.get('/books/:id', asyncHandler(async(req,res) => {
  const book = await Book.findByPk(req.params.id);
  if(book){
  res.render('update-book', {book})
  focusInput();
  } else{
    throw error;
  }
}));

router.post('/books/new', asyncHandler(async(req,res) => {
  let books;
  try {
    books = await Book.create(req.body);
    res.redirect("/books/" + books.id);
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      books = await Book.build(req.body);
      res.render("new-book", { books, errors: error.errors})
    } else {
      throw error;
    }  
  }
}));


//Update a book information
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    console.log(book)
    if(book) {
      await book.update(req.body);
      res.redirect("/books/" + book.id);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("update-book", { book, errors: error.errors})
    } else {
      throw error;
    }
  }
}));

router.post('/books/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    res.sendStatus(404);
  }
}));


module.exports = router;
