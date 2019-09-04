const chai = require("chai")
const { expect } = chai
const chair = chai
const jwt = require("jsonwebtoken")

const { app } = require("../src/server")

const signUp = async (username = "username", password = "password123", passwordCheck = "password123") => {
    const response = await chai
    .request(app)
    .post('/auth/signup')
    .send({
        username: username,
        password: password,
        passwordCheck: passwordCheck
    })

    return response
}

describe("auth.route.js", () => {
    it("POST /auth/signup", async () => {
        const response = await signUp()
        expect(response.status).to.eq(200)
        expect(response.body.username).to.eq("username")
        expect(response.body.password).to.eq(undefined)
    })
})