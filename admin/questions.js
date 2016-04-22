var addForm = function() {
	return $('<form><h2>New Survey Question</h2>' +
		'<div class="form-group">' +
		'<label for="question">Prompt</label>' +
		'<input type="text" class="form-control" id="question" placeholder="Survey Text" />' +
		'</div>' +
		[1,2,3,4].map(function(i) {
			return '<div class="form-group"><label for="answer' + i + '">Option</label>' +
			'<input type="text" class="form-control answer" id="answer' + i + '" placeholder="N/A" />' +
			'</div>';
		}).join("") +
		'<button type="submit" class="btn btn-default">Save</button>' +
		'</form>')[0];
};

var saveQuestion = function(form) {
	var data = {
		question: $("#question", form)[0].value,
		answers: $(".answer", form).map(function() {
			return this.value;
		}).filter(function(s) {
			return this.length > 0;
		}).toArray()
	};
	if (data.answers.length >= 2 && data.question.length) {
		createQuestion(data).then(function() {
			$("input", $(form)).each(function() {
				this.value = "";
			});
		})
	} else {
		alert("Must enter at least 2 answers")
	}
	return false;
}

var start = function() {
	getQuestions().then(function(questions) {
		Promise.all(questions.map(function(question) {
			return new Promise(function(done) {
				getQuestion(question.id).then(function(question) {
					done(question);
				})
			}) 
		})).then(function(questions) {
			questions.forEach(function(question) {
				var container = document.createElement("div");
				var sectionHeader = document.createElement("h2");
				sectionHeader.innerText = question.question;
				container.appendChild(sectionHeader);
				var answers = document.createElement("ul");
				answers.className = "list-group";
				question.answers.forEach(function(a) {
					var option = document.createElement("li");
					option.className = "list-group-item";
					option.innerText = a.text;
					answers.appendChild(option);
				});
				container.appendChild(answers);

				document.body.appendChild(container);
			});

			var form = addForm();
			$("button", form).on("click", saveQuestion.bind(this, form));
			document.body.appendChild(form);
		});
	});
}

setTimeout(start,1000);