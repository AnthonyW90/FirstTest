const chai = require("chai")
const { expect } = chai
const chair = chai
const jwt = require("jsonwebtoken")

const { app } = require("../src/server")

const signUp = async (username = "username", password = "password123", passwordCheck = "password123", admin = false) => {
    const response = await chai
    .request(app)
    .post('/auth/signup')
    .send({
        username: username,
        password: password,
        passwordCheck: passwordCheck,
        admin: admin
    })

    return response
}

const login = async (username = "username", password = "password123") => {
    const response = await chai
    .request(app)
    .post("/auth/login")
    .send({
        username: username,
        password: password
    })

    return response
}

describe("auth.route.js", () => {
    it("POST /auth/signup: Should allow a valid user to sign up", async () => {
        const response = await signUp()
        expect(response.status).to.eq(200)
        expect(response.body.username).to.eq("username")
        expect(response.body.password).to.eq(undefined)
    })

    it("POST /auth/signup: 422 invalid username", async () => {
        const response = await signUp("lkj")

        expect(response.status).to.eq(422)
    })

    it("POST /auth/signup: 422 invalid password", async () => {
        const response = await signUp(password = "lkj")

        expect(response.status).to.eq(422)
    })

    it("POST /auth/signup: 422 invalid passwordCheck", async () => {
        const response = await signUp("username2", "password123", "lksjdflkdsj")

        expect(response.status).to.eq(422)
    })

    it("POST /auth/signup: 422 user already exists", async () => {
        const response = await signUp("username", "password123", "lksjdflkdsj")

        expect(response.status).to.eq(422)
    })

    it("POST /auth/login: Should allow a valid user to login", async () => {
        const response = await login()

        expect(response.status).to.eq(200)
        const user = jwt.verify(response.body.token, "CHANGEME!")
        expect(user.username).to.eq("username")
    })
    
    it("POST /auth/login: 403 invalid username", async () => {
        const response = await login("lkjlkj")

        expect(response.status).to.eq(403)
    })

    it("POST /auth/login: 403 invalid password", async () => {
        const response = await login("username", "lkjlkjlk")

        expect(response.status).to.eq(403)
    })

    it("POST /auth/login: 422 if username or password is incorrect length", async () => {
        const response = await login("lkj")

        expect(response.status).to.eq(422)
    })
})

module.exports = {
    signUp,
    login
}