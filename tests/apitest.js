"use strict"

const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config");
const expect = require("chai").expect;
const request = require("supertest");

//app setup
//well maybe i should just make the app.js to a exported module
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const router = require("../routes/router");
app.use(router);

const User = require("../models/User");
const Coffee = require("../models/Coffee");

//===========================================
// home test
//===========================================

describe("GET /", ()=>{
    it("OK", (done) =>{
        request(app).get("/")
        .then((res) => {
            expect(res.body.message).contains("success");
            done();
        })
        .catch((err)=>{
            done(err);
        });
    });
});

//===============================================
// get coffee tests
//===============================================
/*
describe("GET /coffees", ()=>{
    before((done) =>{
        connectDB()
        .then(done())
        .catch((err) => done(err));
    });

    after((done) =>{
        closeDB()
        .then(() => done())
        .catch((err) => done(err));
    });

    it("TEST: getting coffees from server", (done) =>{
        request(app).get("/coffees")
        .then((res) => {
            expect(res.body[0]).property("name");
            done();
        })
        .catch((err)=>{
            done(err);
        });
    });
});
*/
//===============================================
// login test
//===============================================
describe("POST /login", ()=>{
    before((done) =>{
        connectDB()
        .then(done())
        .catch((err) => done(err));
    });

    after((done) =>{
        closeDB()
        .then(() => done())
        .catch((err) => done(err));
    });

    it("TEST: login", (done) =>{
        request(app).post("/login")
        .send(new User({
            username: "5555555",
            password: "newpass"
        }))
        .then((res) => {
            console.log(res.body);
            expect(res.body.message).contains("success");
            done();
        })
        .catch((err)=>{
            done(err);
        });
    });
});

//===============================================
// add coffee tests
//===============================================
/*
describe("POST /add", ()=>{
    before((done) =>{
        connectDB()
        .then(() => done())
        .catch((err) => done(err));
    });

    after((done) =>{
        closeDB()
        .then(() => done())
        .catch((err) => done(err));
    });

    it("TEST: adding coffee to server", (done) =>{
        const newCoffee = {
            name: "testCoffee",
            desc: "this is test coffee",
            addDate: new Date()
        };
        request(router).post("/add")
        .send(newCoffee)
        .then((res) =>{
            expect(res.body.message).contains("added");
            done();
        })
        .catch((err)=>{
            done(err);
        });
    });
});
*/
//===============================================
// edit coffee tests
//===============================================
/*
describe("PUT /edit", ()=>{
    before((done) =>{
        connectDB()
        .then(() => done())
        .catch((err) => done(err));
    });

    after((done) =>{
        closeDB()
        .then(() => done())
        .catch((err) => done(err));
    });

    it("TEST: editing coffee info", (done) =>{
        const editedCoffee = {
            name: "testCoffee",
            desc: "this is test coffee",
            addDate: new Date()
        };
        request(router).put("/edit")
        .send(editedCoffee)
        .then((res) =>{
            expect(res.body.message).contains("edited");
            done();
        })
        .catch((err)=>{
            done(err);
        });
    });
});
*/
//===============================================
// remove coffee tests
//===============================================
/*
describe("DELETE /remove", ()=>{
    before((done) =>{
        connectDB()
        .then(next =>{
            addCoffee();
            done();
        })
        .catch((err) => done(err));
    });

    after((done) =>{
        closeDB()
        .then(() => done())
        .catch((err) => done(err));
    });

    it("TEST: login", (done) =>{
        const testUser = {
            username: "testuser",
            password: "password"
        };
        request(router).post("/login")
        .send(testUser)
        .then((res) =>{
            expect(res.body).property("token");
            done();
        })
        .catch((err)=>{
            done(err);
        });
    });
});
*/

//================================================
// reusable methods
//================================================
function connectDB(){
    return mongoose.connect(
        process.env.DB_CONNECTION,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );
}

function closeDB(){
    return mongoose.connection.close();
}

function addCoffee(){
    const sampleCoffee = {
        name: "testCoffee",
        desc: "test coffee description",
        addDate: new Date().toISOString()
    }
    request(router).post("/add")
        .send(sampleCoffee)
        .then((res) =>{
            return res;
        })
        .catch((err)=>{
            done(err);
        });
}

function login(){
    const testUser = {
        username: "testuser",
        password: "password"
    };
    request(router).post("/login")
        .send(testUser)
        .then((res) =>{
            expect(res.body).property("token");
            done();
        })
        .catch((err)=>{
            done(err);
        });
}