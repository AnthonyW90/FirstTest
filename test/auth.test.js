const chai = require("chai")
const { expect, request } = chai
const chair = chai
const jwt = require("jsonwebtoken")

const { app } = require("../src/server")

const signUp = async (username = "username", password = "password123", passwordCheck = "password123") => {
    const response = await request(app)
    .post('/auth/signup')
    .send({
        username: username,
        password: password,
        passwordCheck: password
    })

    return response
}

describe("auth.route.js", () => {
    it("POST /auth/signup", () => {
        const response = await signUp()

        expect(response.status).to.eq(200)
        expect(response.body.username).to.eq("username")
        expect(response.body.password).to.eq(undefined)
    })
})