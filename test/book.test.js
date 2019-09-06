const chai = require("chai")
const mongoose = require("mongoose")
const { expect } = chai
const dummyAPI = require("./dummy-api")
const { ObjectId } = mongoose.Types

const { app } = require("../src/server")
const { signUp, login } = require("./auth.test")

const addBook = async (title, author, checkedout, token) => {
    const res = await chai
    .request(app)
    .post("/books/")
    .set("Authorization", `Bearer ${token}`)
    .send({
        booktitle: title,
        author: author,
        checkedout: checkedout
    })

    return res
}

const getBook = async () => {
    const res = await chai
        .request(app)
        .get("/books/")
    return res.body[0]
}


describe("book.route.js", () => {
    before(async () => {
        await signUp("superAdmin", "password123", "password123", true)
        const user = await login("superAdmin")
        const token = user.body.token

        for (book in dummyAPI) {
            await addBook(dummyAPI[book].title, dummyAPI[book].author, dummyAPI[book].checkedout, token)
        }

    })

    it("GET /books/all Should display list of all books", async () => {
        const res = await chai
        .request(app)
        .get("/books/all")

        expect(res.status).to.eq(200)
        expect(res.body).to.be.lengthOf(7)
    })

    it("GET /books/ Should display list of all non checked out books", async () => {
        const res = await chai
        .request(app)
        .get("/books/")

        expect(res.status).to.eq(200)
        expect(res.body).to.be.lengthOf(6)
    })

    it("GET /books/:_id Should return a book with given id", async () => {
        const book = await getBook()

        const res = await chai
        .request(app)
        .get(`/books/${book._id}`)
        
        expect(res.status).to.eq(200)
    })

    it("GET /books/:_id 404 book not found", async () => {
        const book = new ObjectId()
        const res = await chai
        .request(app)
        .get(`/books/${book}`)

        expect(res.status).to.eq(404)
    })

    it("POST /books/ Should allow an admin user to add a book", async () => {
        const sign = await signUp("admin","password123","password123", true)
        const user = await login("admin")
        
        const res = await chai
        .request(app)
        .post("/books/")
        .send({
            booktitle: "Some title",
            author: "Some old guy"
        })
        .set("Authorization", `Bearer ${user.body.token}`)
        expect(res.status).to.eq(200)
    })

    it("POST /books/ Should not allow a non-admin user to add a book", async () => {
        const user = await login()
        
        const res = await chai
        .request(app)
        .post("/books/")
        .send({
            booktitle: "Some title",
            author: "Some old guy"
        })
        .set("Authorization", `Bearer ${user.body.token}`)

        expect(res.status).to.gte(400).lt(500)
    })

    it("PATCH /books/:_id Should allow an admin user to update a book", async () => {
        const user = await login("admin")
        const book = await getBook()

        const res = await chai
        .request(app)
        .patch(`/books/${book._id}`)
        .send({
            booktitle: "Test title",
            author: "Test author",
            checkedout: false
        })
        .set("Authorization", `Bearer ${user.body.token}`)

        expect(res.status).to.eq(200)
        expect(res.body.booktitle).to.eq("Test title")
        expect(res.body.author).to.eq("Test author")
        expect(res.body.checkedout).to.eq(false)
    })

    it("PATCH /books/:_id 404 Book not found", async () => {
        const user = await login("admin")
        const book = new ObjectId()

        const res = await chai
        .request(app)
        .patch(`/books/${book}`)
        .send({
            booktitle: "Test title",
            author: "Test author",
            checkedout: false
        })
        .set("Authorization", `Bearer ${user.body.token}`)

        expect(res.status).to.eq(404)
    })

    it("PATCH /books/:_id Should not allow a non-admin user to update a book", async () => {
        const user = await login()
        const book = await getBook()
        
        const res = await chai
        .request(app)
        .patch(`/books/${book._id}`)
        .send({
            booktitle: "Test title",
            author: "Test author",
            checkedout: false
        })
        .set("Authorization", `Bearer ${user.body.token}`)

        expect(res.status).to.eq(401)
    })

    it("DELETE /books/:_id Should allow an admin user to delete a book", async () => {
        const user = await login("admin")
        const book = await getBook()
        
        const res = await chai
        .request(app)
        .delete(`/books/${book._id}`)
        .set("Authorization", `Bearer ${user.body.token}`)

        expect(res.status).to.eq(200)
    })

    it("DELETE /books/:_id 404 Book not found", async () => {
        const user = await login("admin")
        const book = new ObjectId()
        
        const res = await chai
        .request(app)
        .delete(`/books/${book}`)
        .set("Authorization", `Bearer ${user.body.token}`)

        expect(res.status).to.eq(404)
    })

    it("DELETE /books/:_id Should not allow a non-admin user to update a book", async () => {
        const user = await login()
        const book = await getBook()
        
        const res = await chai
        .request(app)
        .delete(`/books/${book._id}`)
        .set("Authorization", `Bearer ${user.body.token}`)

        expect(res.status).to.eq(401)
    })

    

})