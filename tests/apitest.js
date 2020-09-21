"use strict"

require("dotenv/config");
const expect = require("chai").expect;
const request = require("supertest");

//app setup
//well maybe i should just make the app.js to a exported module
const express = require("express");
const app = express();
const router = require("../routes/router");
app.use(router);
const mongoose = require("mongoose");

//===============================================
/*
describe("POST /", ()=>{
    before((done) =>{
        mongoose.connect(
            process.env.DB_CONNECTION,
            { useNewUrlParser: true, useUnifiedTopology: true }, 
            () => console.log("db connected")
        )
        .then(() => done())
        .catch((err) => done(err));
    });

    after((done) =>{
        mongoose.connection.close()
        .then(() => done())
        .catch((err) => done(err));
    });

    it("OK", (done) =>{
        request(router).post("/")
        .send({ username: "123", password: "123" })
        .then((res) =>{
            const body = res.body;

            expect(body).to.contain.property("hello");
            done()
        })
        .catch((err)=>{
            done(err);
        });
    });
});
*/

describe("GET /", ()=>{
    it("OK", (done) =>{
        request(app).get("/")
        .then((res) => {
            expect(res.text).equals("hi");
            done();
        })
        .catch((err)=>{
            done(err);
        });
    });
});

describe("GET /coffees", ()=>{
    before((done) =>{
        connectDB()
        .then(done())
        .catch((err) => done(err));
    });

    it("OK", (done) =>{
        request(app).get("/coffees")
        .then((res) => {
            const body = res.body;
            expect(body[0]).property("name");
            done();
        })
        .catch((err)=>{
            done(err);
        });
    });
});

//================================================

function connectDB(){
    return mongoose.connect(
        process.env.DB_CONNECTION,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );
}