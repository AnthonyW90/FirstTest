const chai = require("chai")
const { expect } = chai
const dummyAPI = require("./dummy-api")

const { app } = require("../src/server")
const { signUp, login } = require("./auth.test")

const addBook = async (title, author, token) => {
    const res = await chai
    .request(app)
    .post("/books/")
    .set("Authorization", `Bearer ${token}`)
    .send({
        booktitle: title,
        author: author
    })

    return res
}


describe("book.route.js", () => {
    before(async () => {
        await signUp("superAdmin", "password123", "password123", true)
        const user = await login("superAdmin")
        const token = user.body.token

        for (book in dummyAPI) {
            await addBook(dummyAPI[book].title, dummyAPI[book].author, token)
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