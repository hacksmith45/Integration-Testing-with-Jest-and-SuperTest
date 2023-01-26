const express = require('express');
const router = express.Router();
const bookData = require('../data/books.json')
const { check,validationResult } = require('express-validator')
const {save} = require('../services/save')

router.get('/',(req,res) => {
    res.json(bookData)
})

router.post('/', [
    check('name','Book name is required').not().isEmpty(),
    check('author','Author name is required').not().isEmpty()
] , (req,res) => {
     const { name,author } = req.body
     const errors = validationResult(req)

     if(!errors.isEmpty()){
         return res.status(400).json({ errors:errors.array() })
     }

     bookData.push({
        name,
        author,
        id:Math.random(),
     })

    const isSaved = save(bookData)

    if(!isSaved){
     return res.status(400).json({ error:true, message:"Could not save book"})
    }
    res.json({ message:"success"})
})

router.put('/:bookID', (req,res) => {
   const {bookID} = req.params
   const {name, author} = req.body

   const findBook = bookData.find((book) => book.id == bookID)

   if(!findBook){
      return res.status(404).send({
          error:true,
          message:"Book not found"
      })
   }
   
   let newBook = null
   const newBookData = bookData.map((book) => {
       if(book.id == bookID){
           newBook = {
             ...book,
             name,
             author
           }

           return newBook
       }
        return book
   })

   const isSaved = save(newBookData)
    
   if(!isSaved){
    return res.status(400).json({ error:true, message:"Could not save book"})
   }
   res.status(201).json(newBook)


})

router.delete('/:bookID', (req,res) => {
    const {bookID} = req.params
    const  findBook = bookData.find((book) => book.id == bookID)

    if(!findBook){
        return res.status(404).send({
            error:true,
            message:"Book not found"
        })
    }

    const newBooks = bookData.filter((book) => book.id != bookID );

    const isSaved = save(newBooks)
    
    if(!isSaved){
     return res.status(400).json({ error:true, message:"Could not save book"})
    }
    res.status(201).json({
        message:"Success"
    })
 
    
})
module.exports = router