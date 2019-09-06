const chai = require("chai")
const { expect } = chai
const dummyAPI = require("./dummy-api")

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

    it("PATCH /books/ Should not allow a non-admin user to update a book", async () => {
        const user = await login()
        
        const res = await chai
        .request(app)
        .patch("/books/")
        .send({
            booktitle: "Test title",
            author: "Test author"
        })
        .set("Authorization", `Bearer ${user.body.token}`)

        expect(res.status).to.gte(400).lt(500)
    })

})