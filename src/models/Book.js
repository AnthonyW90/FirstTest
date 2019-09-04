const mongoose = require("mongoose");

const { Schema } = mongoose;




const BookSchema = Schema({
    booktitle: {
        type: String,
        required: true, 
    },
    author: {
        type: String, 
        unique: true
    },
    checkedout: {
        type: Boolean 
        
    },
    user:{
        type: ObjectId,
        ref: "User",

    }
})



const User = mongoose.model("Book", BookSchema);
module.exports = Book;