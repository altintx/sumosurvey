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
function guid() { // from http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
function createQuestion(q) {
	return $.post({
		url: "/api/questions",
		data: JSON.stringify(q),
		contentType: "application/json",
		dataType: "json"
	});
}