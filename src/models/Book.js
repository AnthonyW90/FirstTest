const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types




const BookSchema = Schema({
    booktitle: {
        type: String,
        required: true, 
    },
    author: {
        type: String, 
        unique: false
    },
    checkedout: {
        type: Boolean,
        default: false
        
    },
    user:{
        type: ObjectId,
        ref: "user",

    }
})



const Book = mongoose.model("Book", BookSchema);
module.exports = Book;