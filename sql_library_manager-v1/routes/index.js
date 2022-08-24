var express = require('express');
const db = require('../models');
var router = express.Router();
const Book = require('../models').Book;
const { Op } = require('sequelize');

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

/* GET home page. */
router.get('/', asyncHandler(async(req, res) =>
{
      res.redirect("/books");
}
  )
);

router.get('/books', asyncHandler(async(req,res) => {
  const search = req.body.search;
  let books = await Book.findAll()
  const pageLength = books.length
  const pageMax = 10;
  const views = req.query.views
  if(views && ((views*pageMax) <= pageMax)){
  books = books.slice((views-1),(pageMax))
  }
  else if(views && ((views*pageMax) > pageMax)){
    books=books.slice(((views*pageMax)-pageMax),((pageMax*views)))
  }
  else{
    books=books.slice(0,10);
  }

  res.render('index', {books
   ,perpage: Math.ceil(pageLength/pageMax),
   searchValue: search
    })
  }));

router.get('/books/new', asyncHandler(async(req,res) => {
  res.render('new-book', {books:{}})
}));

router.get('/books/:id', asyncHandler(async(req,res,next) => {
  const book = await Book.findByPk(req.params.id);
  if(book){
  res.render('update-book', {book})
  } else{
    const err = new Error("The book you've searched for does not exist!")
    err.status = 404;
    next(err);
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

router.post('/books', asyncHandler(async(req,res) => {
  const searchInput = req.body.searchEntry[0];
  let books = await Book.findAll({
    where: {
      [Op.or]: 
        { 
          title: {
            [Op.like]:`%${searchInput}%`
          },
          author: {
            [Op.like]: `%${searchInput}%`
          },
          genre: {
            [Op.like]: `%${searchInput}%`
          },
          year: {
            [Op.like]: `%${searchInput}%`
          },
        }        
    }// end of where clause
   });
   res.render('index', {books})
}));




//Update a book information
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect("/books/" + book.id);
    } else {
      res.render("page-not-found");
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
