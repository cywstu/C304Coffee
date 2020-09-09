/*
const mongoose = require("mongoose");

mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("connected")
);
/*
/*
const dbName = "c304db";

const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const connectDB = async() =>{
    await MongoClient.connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParse: true
    });
    console.log("db connected!");
    const db = client.db(dbName);
       
    client.close();
};
*/

//module.exports = connectDB;