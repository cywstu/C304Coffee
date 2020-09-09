const dbName = "c304db";

const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const uri = "mongodb+srv://c304:c304coffee@cluster0.uoxfe.mongodb.net/<dbname>?retryWrites=true&w=majority";

const connectDB = async() =>{
    await MongoClient.connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParse: true
    });
    console.log("db connected!");
    const db = client.db(dbName);
       
    client.close();
};

module.exports = connectDB;