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
		console.log(q);
	});
}

function getNextQuestion() {
	return new Promise(function(done) {
		getQuestions().then(function(questions) {
			var answered = getAnswered();
			var unanswered = questions.filter(function(q) {
				return answered.indexOf(q.id) == -1;
			});
			var question = unanswered[Math.floor(Math.random() * unanswered.length)];

			getQuestion(question.id).then(done);
		});
	});
}

start();