function getAnswered() {
	var a = localStorage.getItem("answered");
	return a || [];	
}

function getQuestions() {
	return $.getJSON({
		url: "/api/questions"
	});
}

function getQuestion(id) {
	return $.getJSON({
		url: "/api/questions/" + id
	});
}

function start() {
	getNextQuestion().then(function(q) {
		if (q)
			console.log(q);
		else
			"There are no more questions";
	});
}

function getNextQuestion() {
	return new Promise(function(done) {
		getQuestions().then(function(questions) {
			var answered = getAnswered();
			var unanswered = questions.filter(function(q) {
				return answered.indexOf(q.id) == -1;
			});
			if (unanswered.length) {
				var question = unanswered[Math.floor(Math.random() * unanswered.length)];
				getQuestion(question.id).then(done);
			} else {
				done(false);
			}
		});
	});
}

start();