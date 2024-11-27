const mongoose = require ("mongoose");

const user_type = mongoose.Schema({
    user_type: { type: String },
    
})

module.exports = mongoose.model("user_type",user_type);
