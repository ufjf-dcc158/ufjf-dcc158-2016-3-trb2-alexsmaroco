process.env.NODE_ENV = process.env.NODE_ENV||"devel";

var mongoose = require('./config/mongoose');
var express = require("./config/express");
var db = mongoose();
var app = express();
app.listen(3000);
console.log("Executando na porta http://localhost:3000...");

module.exports = app;
