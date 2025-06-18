/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = function (app) {
  let books = [];

  app.route('/api/books')
    // Get list of books and put in array of objects
    .get(function (req, res){
      const formatBooks = books.map(book => ({
        _id: book._id,
        title: book.title,
        commentcount: book.comments.length
      }));
      res.json(formatBooks)
    })
    
    // Post new books to the database, check for title
    .post(function (req, res){
      const title = req.body.title;
      if (!title) return res.send('missing required field title');

      const newBook = {
        _id: uuidv4(),
        title,
        comments: []
      };

      books.push(newBook);
      res.json({ _id: newBook._id, title: newBook.title });
    })
    
    // Delete all books from the database
    .delete(function(req, res){
      books = [];
      res.send('complete delete successful');
    });

  app.route('/api/books/:id')
    // Get book based on _id, check _id
    .get(function (req, res){
      const bookid = req.params.id;
      const book = books.find(b => b._id === bookid);
      
      if (!book) return res.send('no book exists');
      res.json(book);
    })
    
    // Comment on a book in the database, check for comment field
    .post(function(req, res){
      const bookid = req.params.id;
      const comment = req.body.comment;

      if (!comment) return res.send('missing required field comment');

      const book = books.find(b => b._id === bookid);
      if (!book) return res.send('no book exists');

      book.comments.push(comment);
      res.json(book);
    })
    
    // Delete book based on _id, check if _id is valid
    .delete(function(req, res){
      const bookid = req.params.id;
      const index = books.findIndex(b => b._id === bookid);

      if (index === -1) return res.send('no book exists');

      books.splice(index, 1);
      res.send('delete successful');
    });
};
