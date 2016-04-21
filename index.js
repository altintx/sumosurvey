var express = require("express");
var db = require('./models');
var Promise = require("rsvp").Promise;

var server = express();

express.static("public");


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
	if (!("question" in req.params && "answers" in req.params && typeof params.answers == "Object")) {
		return res.send({
			success: false,
			message: "Send " + JSON.stringify({ "question": "Question Text", "Answers": [] })
		});

	};
	var questionId = 0;
	db.Question.create({
		text: req.params.question
	}).then(function(q) {
		questionId = q.id;
		return Promise.all(req.params.answers.map(function(answer) {
			return db.Answer.create({
				text: answer,
				questionId: questionId
			}).then(done);
		}));
	}).then(function(answers) {
		res.redirect("/api/questions/" + questionId);
	});
});

server.listen(3000);