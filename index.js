var express = require("express");
var Sequelize = require('sequelize');

var conn = {};
if (!("MYSQLHOST" in process.env && "MYSQLUSER" in process.env && "MYSQLPASSWORD" in process.env)) {
	console.error("Expecting: MYSQLHOST=... MYSQLUSER=... MYSQLPASSWORD=... " + process.argv.join(" "));
	process.exit();
} else {
	conn.host = process.env.MYSQLHOST;
	conn.user = process.env.MYSQLUSER;
	conn.pass = process.env.MYSQLPASS;
}
var db = new Sequelize(conn.host, conn.user, conn.pass);


var server = express();

var Question = db.define('survey_question', {
  question: Sequelize.STRING
});
var Answer = db.define('survey_question', {
  question: Sequelize.STRING
});


server.get("/", function(req, res) {

})

server.listen(3000);