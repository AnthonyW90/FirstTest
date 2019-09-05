const chai = require("chai")
const { expect } = chai

const { app } = require("../src/server")
const { login } = require("./auth.test")


describe("user.test.js", () => {
    it("GET /user/: Should allow a valid user to view thier profile", async () => {
        const user = await login()
        const token = user.body.token

        const res = await chai
        .request(app)
        .get(`/auth/profile`)
        .set("Authorization", `Bearer ${token}`)

        expect(res.status).to.eq(200)
    })
    
    it("GET /user/: Should not allow an invalid user to view a profile", async () => {
        const token = "Not a valid token"

        const res = await chai
        .request(app)
        .get(`/auth/profile`)
        .set("Authorization", `Bearer ${token}`)

        expect(res.status).to.eq(401)
    })

})