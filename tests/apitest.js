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
app.use("/", router);

const User = require("../models/User");
const Coffee = require("../models/Coffee");

//===========================================
// home test
//===========================================

describe("GET /", ()=>{
    it("TEST: get home page", (done) =>{
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
// get coffee tests(done)
//===============================================

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

    
    //it("TEST: getting single coffee from server", (done) =>{
    //    request(app).get("/coffees/testCoffee")
    //    .then((res) => {
    //        expect(res.body).property("name");
    //        done();
    //    })
    //    .catch((err)=>{
    //        done(err);
    //    });
    //});
    
    
});

//===============================================
// login test(done)
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
        .send(testUser)
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
// add coffee tests(done)
//===============================================

describe("POST /add", ()=>{
    let loginToken;
    let coffeeId;
    
    before((done) =>{
        connectDB()
        .then(() =>{
            //login
            request(app).post("/login")
            .send(testUser)
            .then((result) => {
                expect(result.body.message).contains("success");
                loginToken = result.body.token;
                done();
            })
        })
        .catch((err) => done(err));
    });

    after((done) =>{
        request(app).delete("/remove/" + coffeeId)
        .set('Authorization', loginToken)
        .then((deleteResult) =>{
            console.log(deleteResult.body.message);
            expect(deleteResult.body.message).contains("removed");
            closeDB()
            .then(() => done())
            .catch((err) => done(err));
        })
        .catch((err)=> done(err));
    });

    it("TEST: adding coffee to server", (done) =>{
        //login
        request(app).post("/login")
        .send(testUser)
        .then(() =>{   //add coffee
            request(app).post("/add")
            .set('Authorization', loginToken)
            .field("name", "testCoffee")
            .field("desc", "this is test coffee")
            .attach("image", "./tests/test.jpg")
            .then((res) =>{
                coffeeId = res.body.id;
                expect(res.body.message).contains("added");
                done();
            })
            .catch((err)=>{
                done(err);
            });
        })
        .catch((err) =>{
            done(err);
        });
    });
});


//===============================================
// edit coffee tests(done)
//===============================================

describe("PUT /edit", ()=>{
    //will use later
    let loginToken;
    let coffeeId;

    before((done) =>{
        connectDB()
        .then(() =>{
            //login
            request(app).post("/login")
            .send(testUser)
            .then((result) => {
                expect(result.body.message).contains("success");
                loginToken = result.body.token;
            })
            .then(() =>{  //add coffee
                request(app).post("/add")
                .set('Authorization', loginToken)
                .field("name", "TestCoffee2")
                .field("desc", "this is test coffee 2")
                .attach("image", "./tests/test.jpg")
                .then((data) =>{
                    expect(data.body.message).contains("added");
                    coffeeId = data.body.id;
                    done();
                })
                .catch((err) => done(err));
            })
            .catch((err) => done(err));
        })
        .catch((err) => done(err));
    });

    after((done) =>{
        request(app).delete("/remove/" + coffeeId)
        .set('Authorization', loginToken)
        .then((deleteResult) =>{
            console.log(deleteResult.body.message);
            expect(deleteResult.body.message).contains("removed");
            closeDB()
            .then(() => done())
            .catch((err) => done(err));
        })
        .catch((err)=> done(err));
    });

    it("TEST: updating coffee info", (done) =>{
        //editing coffee
        request(app).put("/edit/" + coffeeId)
        .set('Authorization', loginToken)
        .field("name", "changedTestCoffee")
        .field("desc", "this coffee's info has been changed")
        .attach("image", "./tests/changed.jpg")
        .then((editResult) =>{
            console.log(editResult.body.message);
            expect(editResult.body.message).contains("edited");
            done();
        })
        .catch((err)=>{
            done(err);
        });
    });
});


//===============================================
// remove coffee(done)
//===============================================

describe("DELETE /remove", ()=>{
    //will use later
    let loginToken;
    let coffeeId;

    before((done) =>{
        connectDB()
        .then(() =>{
            //login
            request(app).post("/login")
            .send(testUser)
            .then((result) => {
                expect(result.body.message).contains("success");
                loginToken = result.body.token;
            })
            .then(() =>{  //add coffee
                request(app).post("/add")
                .set('Authorization', loginToken)
                .field("name", "TestCoffee2")
                .field("desc", "this is test coffee 2")
                .attach("image", "./tests/test.jpg")
                .then((data) =>{
                    expect(data.body.message).contains("added");
                    coffeeId = data.body.id;
                    done();
                })
                .catch((err) => done(err));
            })
            .catch((err) => done(err));
        })
        .catch((err) => done(err));
    });

    after((done) =>{
        closeDB()
        .then(() => done())
        .catch((err) => done(err));
    });

    it("TEST: deleting coffee", (done) =>{
        //remove coffee
        request(app).delete("/remove/" + coffeeId)
        .set('Authorization', loginToken)
        .then((deleteResult) =>{
            console.log(deleteResult.body.message);
            expect(deleteResult.body.message).contains("removed");
            done();
        })
        .catch((err)=>{
            done(err);
        });
    });
});

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

const testUser = new User({
    username: "5555555",
    password: "newpass"
});