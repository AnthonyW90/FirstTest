const chai = require("chai")
const { expect } = chai

const { app } = require("../src/server")
const { signUp, login } = require("./auth.test")

describe("user.test.js", () => {
    it("GET /user/:_id", async () => {
        const user = await login()
        const token = user.body.token

        const res = await chai
        .request(app)
        .get(`/user`)
        .set("Authorization", `Bearer ${token}`)

        expect(res.status).to.eq(200)
    })
})