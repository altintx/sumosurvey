var express = require("express");
var db = require('./models');
var Promise = require("rsvp").Promise;
var bodyParser = require('body-parser')

var server = express();

server.use(express.static("public"));
server.use(express.static("node_modules/rsvp/dist"));

server.use( bodyParser.json() );       // to support JSON-encoded bodies
server.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// db.Question, db.Answer, db.Response
server.get("/api/questions", function(req, res) {
	db.Question.findAll().then(function(questions) {
		res.send(questions);
	})
});

server.get("/api/questions/:id", function(req, res) {
	db.Question.findById(req.params.id).then(function(question) {
		if (question)
			db.Answer.findAll({ questionId: question.id }).then(function(answers) {
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

server.post("/api/questions", function(req, res) {
	if (!("question" in req.body && "answers" in req.body && typeof req.body.answers == "Object")) {
		return res.send({
			success: false,
			message: "Send " + JSON.stringify({ "question": "Question Text", "Answers": [] })
		});
	};
	var questionId = 0;
	db.Question.create({
		text: req.body.question
	}).then(function(q) {
		questionId = q.id;
		return Promise.all(req.body.answers.map(function(answer) {
			return db.Answer.create({
				text: answer,
				questionId: questionId
			}).then(done);
		}));
	}).then(function(answers) {
		res.redirect("/api/questions/" + questionId);
	});
});

server.post("/api/respond", function(req, res) {
	if (!("questionId" in req.body && "answerId" in req.body && "user" in req.body)) {
		console.log(req.body);
		return res.send({
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