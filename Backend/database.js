import mongoose from "mongoose";
import {config} from "./config.js"

const connectDB = async () => {
  try {
    await mongoose.connect(config.db.URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  } catch (error) {
    console.log("Error connecting to DB: " + error);
  }
};

connectDB();

const connection = mongoose.connection;

connection.once("open", () => {
    console.log("DB is connected");
});

connection.on("disconnected", () => {
    console.log("DB is disconnected");
});

connection.on("error", (error) => {
    console.log("error found: " + error);
});

connection.on("reconnected", () => {
    console.log("DB reconnected");
});



