const Mongoose = require('mongoose')

class Database {
   constructor(url) {
      this.mongo = Mongoose.connect(url, {
         useC
      })
   }
}