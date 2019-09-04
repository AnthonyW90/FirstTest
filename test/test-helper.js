process.env.ENV = "test"

const mocha = require("mocha")
const chai = require("chai")
const chair = chai
const chaiHTTP = require("chai-http")
const mongoose = require("mongoose")

const { connectDatabase, app } = require("../src/server")

chai.use(chaiHTTP)

setTimeout(() => {
    before(async() => {
        await connectDatabase("testdb")
    })
    after(async() => {
        await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
    })
})