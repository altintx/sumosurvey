var responses = $.getJSON({ url: "/api/responses" });

var surveyResultDom = function(question) {
	return $("<div><h2>" + question.record.text + "</h2>" +
		"<table>" +
		"<thead><tr><th>Answer</th><th>Picked</th></tr></thead>" +
		"<tbody>" +
		question.answerIds.map(function(r) {
			return "<tr><td>" + question[r].record.text + "</td><td>" + question[r].count + "</td></tr>"
		}).join("") +
		"</tbody></table></div>"
	)[0]
}

function start() {
	responses.then(function(responses) {
		Object.keys(responses).filter(function(key) {
			return key != "success";
		}).forEach(function(questionId) {
			document.body.appendChild(surveyResultDom(responses[questionId]));
		});
	});
}


setTimeout(start,100);