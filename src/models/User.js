const mongoose = require("mongoose");

const { Schema } = mongoose;

const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = Schema({
    username: {
        type: String,
        required: true, 
    },
    password: {
        type: String, 
        unique: true
    },

})

userSchema.virtual("Book", {
    ref: "Book",
    localField: "_id",
    foreignField: "user",
    justOne: false,
  });