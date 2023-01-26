const fs = require('fs')
const path = require('path')

const save = (bookData) => {
       try {
           fs.writeFileSync(path.join(__dirname, "..", "data", "books.json"), JSON.stringify(bookData))
           return true
       } catch (error) {
          return false
       }
}

module.exports = {
    save
};