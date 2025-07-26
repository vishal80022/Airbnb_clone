const mongoose = require("mongoose"); // Requiring mongoose package
const sampleData = require("./data.js"); // Importing data from data.js
const Listing = require("../models/listing.js"); // Importing the Listing model from models/listing.js

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust"); //Here we are using await because it may take time to connect to the database
}

const initDB = async () => {
  await Listing.deleteMany({}); // Deleting all existing listings in the database
  await Listing.insertMany(sampleData.data); // Inserting sample data into the database
  console.log("Database initialized with sample data");
};

initDB();
