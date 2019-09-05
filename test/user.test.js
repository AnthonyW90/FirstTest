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
<<<<<<< HEAD

=======
        .set("Authorization", `Bearer ${token}`)
>>>>>>> c33ccb311d9983e735aa43f587a6645299440842

        expect(res.status).to.eq(200)
    })
})