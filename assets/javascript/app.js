$(document).ready(function(){

//Timer Object
var myWatch;

var stopwatch = {

	time: 20,

	reset: function() {
		stopwatch.time = 20;
	},

	start: function() {
		myWatch = setInterval(stopwatch.count, 1000);
	},

	stop: function() {
		clearInterval(myWatch);
	},

	count: function() {

		if(stopwatch.time == 0){
			stopwatch.stop();
			triviaGame.updateStatus();

		}else{
			sound('tick');
			stopwatch.time--;
			currentTime = stopwatch.timeConverter(stopwatch.time);
		}

		$('#timer').html(currentTime);

	},

	timeConverter: function(t) {

		//  Takes the current time in seconds and convert it to minutes and seconds (mm:ss).
		var minutes = Math.floor(t / 60);
		var seconds = t - (minutes * 60);

		if (seconds < 10) {
		  seconds = "0" + seconds;
		}

		if (minutes === 0) {
		  minutes = "00";
		}

		else if (minutes < 10) {
		  minutes = "0" + minutes;
		}

		return minutes + ":" + seconds;
	}

};


//QA object
var triviaQA = {
	randomQnsIndexList : [],
	numOfQuestions : 10,
	rightAnswerIndex : 0,
	correctAnswer : 0,
	correctImage : '',
	rightAnswers : 0,
	wrongAnswers : 0,
	unansweredQns : 0,

	generateUniqueQuestions : function(){
	
		while(this.randomQnsIndexList.length < this.numOfQuestions){ 

			let randomnumber = Math.floor(Math.random() * dataBank.length)
			if(this.randomQnsIndexList.indexOf(randomnumber) > -1) 
			continue;
			this.randomQnsIndexList[this.randomQnsIndexList.length] = randomnumber;

		}
	},

	getRandomQuestion: function(){
		console.log(this.randomQnsIndexList);

		let questionIndex;

		if (this.randomQnsIndexList.length > 0){
			questionIndex = this.randomQnsIndexList.pop(this.randomQnsIndexList.length - 1);
		}		

		console.log('questionIndex', questionIndex);

		if(questionIndex != undefined || questionIndex != null){
			$("#div-question").html(dataBank[questionIndex].question);
			$("#choice_0").html(dataBank[questionIndex].answer[0]);
			$("#choice_1").html(dataBank[questionIndex].answer[1]);
			$("#choice_2").html(dataBank[questionIndex].answer[2]);
			$("#choice_3").html(dataBank[questionIndex].answer[3]);

			let aIndex = dataBank[questionIndex].ansIndex;	

			this.rightAnswerIndex = dataBank[questionIndex].ansIndex;
			this.correctImage = dataBank[questionIndex].qaURL;
			this.correctAnswer = dataBank[questionIndex].answer[aIndex];

		}
	},

	checkAnswers : function(index){

		if(index === this.rightAnswerIndex){
			this.rightAnswers++;
			this.showCorrect('right');
			console.log("rightanswer ", this.rightAnswers);
		}else{
			this.wrongAnswers++;
			this.showCorrect('wrong');
			console.log("wronganswer ", this.wrongAnswers);
		}
	},

	showCorrect : function(str){

		toggleDivs('pause');

		if(str ==='right'){
			sound('right');
			displayStatus(" YOU GOT THAT RIGHT ! <img src='" + "assets/images/clap.gif" + "' width= 50 height =50>" + "<BR> ", 'green');
		}else if (str === 'wrong'){
			sound('wrong');
			displayStatus(" YOU GOT THAT WRONG ! <img src='" + "assets/images/wrong.gif" + "' width= 50 height =50>" + "<BR> ", 'red');
		}else if (str === 'missed'){
			sound('missed');
			displayStatus(" YOU MISSED ANSWERING ! <img src='" + "assets/images/missed.gif" + "' width= 50 height =50>" + "<BR> ", "red")
		}

		$('#ans-right').html('THE CORRECT ANSWER IS <BR>"' + this.correctAnswer + '"');
		$("#img-result").html("<img width='450' height= '310' src='" + this.correctImage + "'>");						
						
	},

	printResults : function(){

		return "Right Answers : " + this.rightAnswers + '<br>' + 
		"Wrong Answers : " + this.wrongAnswers + '<br>' + 
		"Unanswered Questions: " + this.unansweredQns; 
	},

	checkQAStatus : function(){
		return (this.randomQnsIndexList.length <= 0);	
	},

	doQATimeout : function(){

		if(!this.checkQAStatus()){
			this.unansweredQns++;
			console.log("unanswered ", this.unansweredQns);
			this.showCorrect('missed');
		}

	},

	resetQA : function(){
		this.randomQnsIndexList = [];
		this.rightAnswerIndex = 0,
		this.correctAnswer = 0,
		this.correctImage = '',
		this.rightAnswers = 0,
		this.wrongAnswers = 0,
		this.unansweredQns = 0
	}
};

//game object

var triviaGame = {

	startGame : function(){
		sound("start");
		toggleDivs('show');

		triviaQA.getRandomQuestion();
		stopwatch.reset();
		stopwatch.start();
	},

	pickAnswer : function(index){

		triviaQA.checkAnswers(index);

		if(triviaQA.checkQAStatus()){
			this.showResults();
		}else{
			setTimeout(this.startGame, 7000);
		}
	},

	updateStatus : function(){

		triviaQA.doQATimeout();

		if(triviaQA.checkQAStatus()){
			setTimeout(this.showResults, 5000);			
		}else{
			setTimeout(this.startGame, 7000);
		}
	},

	showResults : function(){
		sound('end');

		let results = triviaQA.printResults();

		console.log(results);

		$('#results-modal').modal('show');
		$('#results-modal').on('shown.bs.modal', function() {
			$('#results-modal').find('#results-body').html(results);
		});

	},

	resetGame : function(){
		// stopwatch.stop();
	}

};

$('#btn-start').on('click', function(){
	triviaQA.generateUniqueQuestions();
	triviaGame.startGame();
});

$('.choiceAns').on('click', function(){
	stopwatch.stop();
	triviaGame.pickAnswer($(this).data("index"));
});

$('#restart').click(function(){
	// location.reload(); //dont reload, reset
	resetModal();

	triviaQA.generateUniqueQuestions();
	triviaGame.startGame();
});	

function toggleDivs(action){
	if(action == 'hide'){
		$('#div-results').hide();
		$('#div-play').hide();
		$('#div-answers').hide();
		$('#div-question').hide();
		$('.div-main').hide();
		$('#timer').hide();
	}else if(action == 'show'){		
		$('#div-play').show();
		$('#div-answers').show();
		$('#div-question').show();
		$('.div-main').show();
		$('#div-results').hide();
		$('#div-start').hide();
		$('#timer').show();
	}else if(action == 'pause'){
		$("#div-results").show();
		$('#div-play').hide();
		$('#div-answers').hide();
	}

}

function resetModal(){
	$('#results-modal').modal('hide');
	$("#results-modal").on("hidden.bs.modal", function(){
	 	$('#results-modal').find('#results-body').html(" ");
	});

	reset(); //resets all game variables
}

function displayStatus(status, color){
	$('#ans-status').html(status);
	$('#ans-status').css("color", color);
}

function reset(){
	stopwatch.stop();
	triviaQA.resetQA();
	triviaGame.resetGame();
}

function sound(str){
    var audio = document.createElement("audio");
    if(str ==="right"){
    	audio.src = "assets/sounds/right.wav";
	}else if(str === "wrong"){
		audio.src = "assets/sounds/wrong.wav";
	}else if(str === "click"){
		audio.src = "assets/sounds/click.wav";
	}else if(str === "tick"){
		audio.src = "assets/sounds/tick.wav";
	}else if(str === "end"){
		audio.src = "assets/sounds/end.wav";
	}else if(str === "start"){
		audio.src = "assets/sounds/start.wav";
	}else if(str === "missed"){
		audio.src = "assets/sounds/sad.wav";
	}
    audio.play();   
}

//begin
toggleDivs('hide');	

});