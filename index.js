var express = require("express");
var db = require('./models');
var Promise = require("rsvp").Promise;
var bodyParser = require('body-parser')
var authentication = require('express-authentication');
var basicAuth = require('basic-auth');

var server = express();
var config = require("./config/config.json");

server.use(express.static("public"));
server.use(express.static("node_modules/rsvp/dist"));

server.use(bodyParser.json());       // to support JSON-encoded bodies
server.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

var auth = function(force) {
	return function auth(req, res, next) {
		// provide the data that was used to authenticate the request; if this is 
		// not set then no attempt to authenticate is registered. 
		var user = basicAuth(req);
		// valid creds
		if (user && user.name == config.admin.user && user.pass == config.admin.password) {
			req.authentication = true;
			next();
		// invalid creds
		} else if (user || force) {
			res.set('WWW-Authenticate', 'Basic realm=Login to Admin');
			res.send(401);
		// no creds
		} else {
			req.authentication = false;
			next();
		}
	}
}

server.use(auth(false));

// db.Question, db.Answer, db.Response
server.get("/api/questions", function(req, res) {
	db.Question.findAll().then(function(questions) {
		res.send(questions);
	})
});

server.use("/admin", auth(true), express.static("admin"));

server.get("/api/questions/:id", function(req, res) {
	console.log(req.authentication);
	db.Question.findById(req.params.id).then(function(question) {
		if (question)
			db.Answer.findAll({ where: { questionId: question.id } }).then(function(answers) {
				res.send({
					success: true,
					question: question.get().text,
					id: question.id,
					answers: answers.map(function(a) {
						return a.get();
					})
				});
			});
		else {
			res.send({ success: false, message: "Unknown question" });
		}
	});
});

server.post("/api/questions", auth(true), function(req, res) {
	if (!("question" in req.body && "answers" in req.body && typeof req.body.answers == "object")) {
		res.send({
			success: false,
			message: "Send " + JSON.stringify({ "question": "Question Text", "answers": [] })
		});
	} else {
		var questionId = 0;
		db.Question.create({
			text: req.body.question
		}).then(function(q) {
			questionId = q.id;
			return Promise.all(req.body.answers.map(function(answer) {
				return db.Answer.create({
					text: answer,
					questionId: questionId
				});
			}));
		}).then(function(answers) {
			res.send({ success: true, questionId: questionId });
		});
	}
});

server.get("/api/responses", auth(true), function(req, res) {
	Promise.all([
		db.Response.findAll({
			attributes: ['questionId', 'answerId']
		}),
		db.Question.findAll(),
		db.Answer.findAll()
	]).then(function(resolutions) {
		var r = resolutions[0], questions = resolutions[1], answers = resolutions[2];
		res.send(r.reduce(function(out, row) {
			try {
				if (!out[row.questionId]) {
					out[row.questionId] = {
						record: questions.filter(function(qRow) {
							return qRow.id == row.questionId;
						})[0],
						answerIds: []
					};
				}
				if (!out[row.questionId][row.answerId]) {
					out[row.questionId][row.answerId] = {
						count: 0,
						record: answers.filter(function(aRow) {
							return aRow.id == row.answerId;
						})[0]
					}
					out[row.questionId].answerIds.push(row.answerId);
				}
				out[row.questionId][row.answerId].count++;
				return out;
			} catch (e) {
				console.error(e);
				res.send({
					success: false
				});
			}
			
		}, { success: true }));
	})
});

server.post("/api/respond", function(req, res) {
	if (!("questionId" in req.body && "answerId" in req.body && "user" in req.body)) {
		console.log(req.body);
		res.send({
			success: false,
			message: "Send " + JSON.stringify({ "questionId": "number", "answerId": "number", "user": "{guid}" })
		});
	};
	db.Response.create({
		questionId: req.body.questionId,
		answerId: req.body.answerId,
		user: req.body.userId
	}).then(function(record) {
		res.send({
			success: true,
			record: record
		});
	})
})

server.listen(3000);