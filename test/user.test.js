const chai = require("chai")
const { expect } = chai
const jwt = require("jsonwebtoken")

const { app } = require("../src/server")
const { login, signUp } = require("./auth.test")


describe("user.test.js", () => {
    it("GET /user/: Should allow a valid user to view thier profile", async () => {
        const user = await login()
        const token = user.body.token

        const res = await chai
        .request(app)
        .get(`/user/`)
        .set("Authorization", `Bearer ${token}`)

        expect(res.status).to.eq(200)
        expect(res.body.username).to.eq("username")
    })
    
    it("GET /user/: Should not allow an invalid user to view a profile", async () => {
        const token = "Not a valid token"

        const res = await chai
        .request(app)
        .get(`/user/`)
        .set("Authorization", `Bearer ${token}`)

        expect(res.status).to.eq(401)
    })

    it("GET /user/all/: Should display a list of users if admin", async () => {
        const user = await login("admin")
        const token = user.body.token

        const res = await chai
        .request(app)
        .get("/user/all")
        .set("Authorization", `Bearer ${token}`)

        expect(res.status).to.eq(200)
    })
    
    it("GET /user/all/: Should 404 if not admin", async () => {
        const user = await login()
        const token = user.body.token

        const res = await chai
        .request(app)
        .get("/user/all")
        .set("Authorization", `Bearer ${token}`)

        expect(res.status).to.eq(404)
    })

    it("PATCH /user/:_id: Should allow an admin to update a profile", async () => {
        await signUp("patchTest1")
        const user = await login("patchTest1")
        const admin = await login("admin")
        const userToken = user.body.token
        const adminToken = admin.body.token

        const userBody = jwt.verify(userToken, "CHANGEME!")
        
        const res = await chai
        .request(app)
        .patch(`/user/${userBody.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            username: "patchTestSuccess",
            password: "password123"
        })

        expect(res.status).to.eq(200)
        expect(res.body.username).to.eq("patchTestSuccess")
    })

    it("PATCH /user/:_id: Should not allow a non-admin user to update a profile", async () => {
        await signUp("patchTest2")
        const user = await login("patchTest2")
        const userToken = user.body.token

        const userID = jwt.verify(userToken, "CHANGEME!")
        
        const res = await chai
        .request(app)
        .patch(`/user/${userID.id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
            username: "patchTestSuccess",
            password: "password123"
        })

        expect(res.status).to.eq(404)
        expect(res.body.username).to.not.eq("pathTestSuccess")
    })

    it("DELETE /user/:_id: Should allow an admin to delete a profile", async () => {
        await signUp("deleteTest1")
        const user = await login("deleteTest1")
        const admin = await login("admin")
        const userToken = user.body.token
        const adminToken = admin.body.token
        const userID = jwt.verify(userToken, "CHANGEME!")

        const res = await chai
        .request(app)
        .delete(`/user/${userID.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        
        expect(res.status).to.eq(200)
        expect(res.body.username).to.eq(userID.username)
    })

    it("DELETE /user/:_id: Should not allow a non-admin to delete a profile", async () => {
        await signUp("deleteTest2")
        const user = await login("deleteTest2")
        const userToken = user.body.token
        const userID = jwt.verify(userToken, "CHANGEME!")

        const res = await chai
        .request(app)
        .delete(`/user/${userID.id}`)
        .set("Authorization", `Bearer ${userToken}`)
        
        expect(res.status).to.eq(404)
    })
})