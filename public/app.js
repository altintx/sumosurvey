function guid() { // from http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

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

function submitResponse(questionDom) {
	return function() {
		var selection = $("input:checked", $(questionDom));
		if (!selection) return; // haven't picked anything yet
		else selection = selection[0];

		$.post({
			url: "/api/respond",
			data: JSON.stringify({
				questionId: questionDom.question.id,
				answerId: selection.value,
				user: getUser()
			}),
			contentType: "application/json",
			dataType: "json"
		}).then(function(response) {
			if (response.success) {
				localStorage.setItem("answered", getAnswered().concat([questionDom.question.id]));
				start(); // get next question
			} else {
				console.error(response);
			}
		});
	}
}

function getUser() {
	var a = localStorage.getItem("user");
	if (!a) {
		a = guid();
		localStorage.setItem("user", a)
	}

	return a;
}

function makeSurveyQuestionDom(question) {
	var container = document.createElement("div");
	container.className="well";
	var h2 = document.createElement("h2");
	h2.innerText = question.question;
	container.appendChild(h2);
	container.question = question;

	question.answers.forEach(function(a) {
		var surveyAnswer = document.createElement("div");
		surveyAnswer.className = "radio";
		var label = document.createElement("label");
		surveyAnswer.appendChild(label);
		var input = document.createElement("input");
		input.type='radio';
		input.name = 'answer';
		input.value = a.id;
		label.appendChild(input);
		label.appendChild(document.createTextNode(a.text));
		container.appendChild(surveyAnswer);
	});

	var submit = document.createElement("button");
	submit.innerText = "Submit";
	submit.addEventListener("click", submitResponse(container));

	container.appendChild(submit);

	return container;

}

function start() {
	getNextQuestion().then(function(q) {
		var $prompter = $("#prompter");
		$prompter.empty();
		if (q)
			$prompter.append(makeSurveyQuestionDom(q));
		else
			$prompter.append($("<h2>There are no more questions</h2>"));
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

setTimeout(start,100);