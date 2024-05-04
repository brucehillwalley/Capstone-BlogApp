"use strict";
/* -------------------------------------------------------
    EXPRESS - Personnel API
------------------------------------------------------- */
require("dotenv").config();
const HOST = process.env?.HOST || "127.0.0.1";
const PORT = process.env?.PORT || 8000;
/* ------------------------------------------------------- */
// npm i swagger-autogen
// https://swagger-autogen.github.io/docs/
/* ------------------------------------------------------- *
const options = {
	openapi:          <string>,     // Enable/Disable OpenAPI.                        By default is null
	language:         <string>,     // Change response language.                      By default is 'en-US'
	disableLogs:      <boolean>,    // Enable/Disable logs.                           By default is false
	autoHeaders:      <boolean>,    // Enable/Disable automatic headers recognition.  By default is true
	autoQuery:        <boolean>,    // Enable/Disable automatic query recognition.    By default is true
	autoBody:         <boolean>,    // Enable/Disable automatic body recognition.     By default is true
	writeOutputFile:  <boolean>     // Enable/Disable writing the output file.        By default is true
};
/* ------------------------------------------------------- */

// const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0', language: 'tr-tr' })
const swaggerAutogen = require("swagger-autogen")();
const packageJson = require("./package.json");

const document = {
  // info: {
  // 	version: "1.0.0",
  // 	title: "Blog API",
  // 	description: "Activity Blog",
  // 	termsOfService: "",
  // 	contact: { name: "bruce", email: "brucehillwalley@gmail.com" },
  // 	license: { name: "BSD License", },
  // },
  info: {
    version: packageJson.version,
    title: packageJson.title,
    description: packageJson.description,
    termsOfService: "",
    contact: { name: packageJson.author, email: "brucehillwalley@gmail.com" },
    license: { name: packageJson.license },
  },
  // host: "http://0.0.0.0:4000" for render local //render dont execute swaggerAutogen.js
  host: `http://${HOST}:${PORT}`,
  basePath: "/",
  schemes: ["http", "https"],
  // SimpleToken Settings:
  securityDefinitions: {
    Token: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
      description:
        "Simple Token Authentication * Example: <b>Token ...tokenKey...</b>",
    },
  },
  security: [{ Token: [] }],
  definitions: {
    "/auth/login": {
      username: {
        type: "String",
        required: true,
      },
      password: {
        type: "String",
        required: true,
      },
    },
    "/auth/refresh": {
      "token.refresh": {
        description: "{ token: { refresh: ... } }",
        type: "String",
        required: true,
      },
    },
    // "Department": {
    // 	"name": {
    // 		type: "ObjectId",
    // 		required: true
    // 	}
    // },

    Category: require("./src/models/category").schema.obj,
    Activity: require("./src/models/activity").schema.obj,
    Comment: require("./src/models/comment").schema.obj,
    View: require("./src/models/view").schema.obj,
    User: require("./src/models/user").schema.obj,
    Token: require("./src/models/token").schema.obj,
    Like: require("./src/models/like").schema.obj,
  },
};

const routes = ["./index.js"];
const outputFile = "./swagger.json";

// Create JSON file:
swaggerAutogen(outputFile, routes, document);
