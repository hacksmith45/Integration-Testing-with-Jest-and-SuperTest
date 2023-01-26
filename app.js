const express = require('express');
const app = express();
const bookRoute = require('./routes/books')

app.use(express.json())

app.use('/api/books',bookRoute)



app.listen(8080,() => {
    console.log('Server is listening on port: 8080')
})