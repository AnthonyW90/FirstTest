const chai = require("chai")
const { expect } = chai

const { app } = require("../src/server")
const { signUp, login } = require("./auth.test")

describe("user.test.js", () => {
    it("GET /user/:_id", async () => {
        const user = await login()
        const token = user.body.token
        const id = user.body.id

        const res = await chai
        .request(app)
        .get(`/user/${id}`)

        expect(res.status).to.eq(200)
    })
})