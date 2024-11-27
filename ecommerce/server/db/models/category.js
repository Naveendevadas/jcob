const mongoose =  require('mongoose');

let category = new mongoose.Schema({
    category : {
        type : String
    }
})

 module.exports = mongoose.model('category',category)