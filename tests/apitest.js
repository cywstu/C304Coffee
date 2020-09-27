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
// get coffee tests(done)
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
*/
//===============================================
// login test(done)
//===============================================
/*
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
*/
//===============================================
// add coffee tests(done)
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
        //login
        request(app).post("/login")
        .send(testUser)
        .then((res) => {
            console.log("1: " + res.body.message);
            expect(res.body.message).contains("success");
            return res.body.token;
        })
        .then((token) =>{   //add coffee
            request(app).post("/add")
            .set('Authorization', token)
            .field("name", "testCoffee")
            .field("desc", "this is test coffee")
            .attach("image", "./tests/test.jpg")
            .then((res) =>{
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
*/

//===============================================
// remove coffee tests
//===============================================
/*
describe("DELETE /remove", ()=>{
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

    it("TEST: removing coffee", (done) =>{
        //login
        request(app).post("/login")
        .send(testUser)
        .then((res) => {
            console.log("1: " + res.body.message);
            expect(res.body.message).contains("success");
            return res.body.token;
        })
        .then((token) =>{   //add coffee
            request(app).post("/add")
            .set('Authorization', token)
            .field("name", "TestCoffee2")
            .field("desc", "this is test coffee 2")
            .attach("image", "./tests/test.jpg")
            .then((data) =>{
                expect(data.body.message).contains("added");
                return {token: token, id: data.body.id};
            })
            .then((data) =>{   //remove coffee
                request(router).delete("/remove/" + data.id)
                .send()
                .then((res) =>{
                    expect(res.body.message).contains("removed");
                    done();
                })
                .catch((err)=>{
                    return err;
                });
            })
            .catch((err)=>{
                return err;
            });
        })
        .catch((err) =>{
            done(err);
        });
    });
});
*/

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

    it("TEST: deleting coffee", (done) =>{
        //remove coffee
        const target = "/remove/"+coffeeId;
        console.log("sending to " + target);
        request(router).delete("/remove/" + coffeeId)
        .set('Authorization', loginToken)
        .then((deleteResult) =>{
            console.log(deleteResult.body.message);
            expect(deleteResult.body.message).contains("deleted");
            done();
        })
        .catch((err)=>{
            done(err);
        });
    });
});
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
        //login
        request(app).post("/login")
        .send(testUser)
        .then((result) => {
            console.log("1: " + result.body.message);
            expect(result.body.message).contains("success");
            return result.body.token;
        })
        .then((token) =>{   //add coffee
            request(app).post("/add")
            .set('Authorization', token)
            .field("name", "TestCoffee2")
            .field("desc", "this is test coffee 2")
            .attach("image", "./tests/test.jpg")
            .then((data) =>{
                expect(data.body.message).contains("added");
                const id = data.body.id;
                request(router).put("/edit/" + id)
                .set('Authorization', token)
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
*/

/* newer
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
                done();
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

    it("TEST: editing coffee info", (done) =>{
        //add coffee
        request(app).post("/add")
        .set('Authorization', loginToken)
        .field("name", "TestCoffee2")
        .field("desc", "this is test coffee 2")
        .attach("image", "./tests/test.jpg")
        .then((data) =>{
            expect(data.body.message).contains("added");
            coffeeId = data.body.id;
            request(router).put("/edit/" + coffeeId)
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

const testUser = new User({
    username: "5555555",
    password: "newpass"
});