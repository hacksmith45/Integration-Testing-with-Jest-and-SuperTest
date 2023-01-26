const express = require('express');
const request = require('supertest');
const bookRoute = require('../routes/books');

const app = express();

app.use(express.json());
app.use('/api/books',bookRoute);

//another alternative of beforeAll()
jest.mock("../data/books.json", () => [
       {"name":"Call of the wild","author":"Louis wilder","id":1},
       {"name":"Love Like no other","author":"Charly Bronsey","id":2},
       {"name":"Dream","author":"Jamie Phillips","id":3}
])

describe("Integration tests for the books API",() => {

     it("should GET all the books from /api/books", async () => {
         
       const { body,statusCode } = await request(app).get("/api/books")

       expect(body).toEqual(
         expect.arrayContaining([
            expect.objectContaining({
                id:expect.any(Number),
                name:expect.any(String),
                author:expect.any(String)
            })
         ])
       )

       expect(statusCode).toBe(200)
     })

     it("should POST /api/books - failure on invalid post body", async () => {
         
         const { body,statusCode } = await request(app).post("/api/books").send({
            name:"",
            author:"Tom Clancy"
         })
          //console.log(body)
          expect(statusCode).toBe(400)

          expect(body).toEqual({
              errors: [
                 {
                    location:"body",
                    msg:"Book name is required",
                    param:"name",
                    value:""
                 }
              ]
          })
     })


     it("should POST /api/books - success", async () => {
         const { body, statusCode } = await request(app).post('/api/books').send({
             name:"Red Rabbit",
             author:"Tom Clancy"
         })

         expect(statusCode).toBe(200)
         
         expect(body).toEqual({
            message:"success"
         })
     })

     it("should PUT /api/books/:id - failure if book isn't found", async () => {
          const { body, statusCode } =  await request(app).put('/api/books/5000').send({
             name:"Gifted Hands",
             author:"Ben Carson"
          })

          expect(statusCode).toBe(404)
          expect(body).toEqual({
             error:true,
             message:"Book not found"
          })
     })


     it("should PUT /api/books/:bookID - Successfully Updated", async () => {
       const { body, statusCode } = await request(app).put('/api/books/2').send({
          name:"Gifted Hands",
          author:"Ben Carson"
       })

       expect(statusCode).toBe(201)
       expect(body).toEqual({
          name:"Gifted Hands",
          author:"Ben Carson",
          id:2
       })
     })

     it("should DELETE /api/books/:bookID - failure when book is not found", async () => {
        const { body, statusCode } = await request(app).delete('/api/books/5000')

        expect(statusCode).toBe(404)
        expect(body).toEqual({
           error:true,
           message:'Book not found'
        })
     })
     
     it("should DELETE /api/books/:bookID - success", async () => {
        const { body, statusCode } = await request(app).delete('/api/books/3')
        
        expect(statusCode).toBe(201)
        expect(body).toEqual({
           message:"Success"
        })

     })

})