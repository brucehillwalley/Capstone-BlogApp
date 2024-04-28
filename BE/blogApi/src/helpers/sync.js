"use strict";
/*-------------------------------------------------------
    NODEJS EXPRESS | BLOG API
------------------------------------------------------- */
/*
    $ npm i axios 
*/
const axios = require("axios");

const User = require("../models/user");

/*-------------------------------------------------------*/

class MyLodash {
    constructor() {}
    static sample(arr) {
      if (!arr || !arr.length) {
        return undefined;
      }
      const randomIndex = Math.floor(Math.random() * arr.length);
      return arr[randomIndex];
    }
  
    static random(min, max) {
      if (min === undefined || max === undefined) {
        throw new Error("Both min and max values are required.");
      }
      if (min > max) {
        throw new Error("min must be less than or equal to max.");
      }
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
  }
  
  // console.log(MyLodash.random(0,5));
  /*-------------------------------------------------------*/
  //? USERS...........................................................
const transferUsersCollection = async () => {
    const { data } = await axios.get(`https://dummyjson.com/users`);
    const dummyUsers = data.users;
    await User.create({
      username: "admin",
      password: "Bruce123*",
      email: "admin@site.com",
      isAdmin: true,
    })
  
    dummyUsers.forEach(async (user) => {
      await User.create({
        ...user,
        id:null,
        password: user.password + "*123",
      });
    });
    console.log(
      `${dummyUsers.length} users successfully transferred to the database.`
    );
  };

//? DROP DATABASE....................................................
async function cleanCollections() {
    try {
      const { mongoose } = require("../configs/dbConnection");
      await mongoose.connection.dropDatabase();
      console.log("- Database and all data DELETED!");
    } catch (error) {
      console.log("- ERROR: Database and all data NOT DELETED", error);
    }
  }
  /*-------------------------------------------------------*/

  module.exports = async () => {
 
    await cleanCollections();
    try {
      await transferUsersCollection();
    
    } catch (error) {
      console.log("- ERROR: Transfer Failed ", error);
    }
  };