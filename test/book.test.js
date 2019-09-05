const chai = require("chai")
const { expect } = chai
const dummyAPI = require("./dummy-api")

const { app } = require("../src/server")
const { signUp, login } = require("./auth.test")

const addBook = async (title, author) => {
    const res = await chai
    .request(app)
    .post("/books/")
    .send({
        title: title,
        author: author
    })
}

// before(() => {
//     dummyAPI.forEach(async (book) => {
//         await addBook(book.title, book.author)
//     })
// })

describe("book.route.js", () => {
    it("GET /books/all Should display list of all books", async () => {
        const res = await chai
        .request(app)
        .get("/books/all")

        expect(res.status).to.eq(200)
    })

    it("GET /books/ Should display list of all non checked out books", async () => {
        const res = await chai
        .request(app)
        .get("/books/")

        expect(res.status).to.eq(200)
    })

    it("POST /books/ Should allow an admin user to add a book", async () => {
        await signUp("admin", "password123", "password123", true)
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
})