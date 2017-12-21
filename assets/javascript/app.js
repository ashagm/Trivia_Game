$(document).ready(function(){

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
			updateStatus();

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

var isGameStarted = false;
var isGameEnd = false;
var isAnswerChosen = false;
var totalQuestions = 0;
var rightAnswers = 0;
var wrongAnswers = 0;
var unansweredQns = 0;
var randomQnsIndexList = [];

toggleDivs('hide');	

$('#btn-start').on('click', function(){
	isGameStarted = true;
	generateUniqueQuestions();
	startGame();
});

$('.choiceAns').on('click', function(){
	stopwatch.stop();
	checkAnswers($(this).data("index"));
});

$('#replay').click(function(){
	$('#myModal').modal('hide');
	$("#myModal").on("hidden.bs.modal", function(){
	 	$('#myModal').find('.modal-body').html(" ");
	});

	isGameStarted = true;
	generateUniqueQuestions();
	startGame();
});	

$('#restart').click(function(){
	$('#myModal').modal('hide');
	$("#myModal").on("hidden.bs.modal", function(){
	 	$('#myModal').find('.modal-body').html(" ");
	});

	location.reload(); //dont reload, reset
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


var	totalQuestions = 0;
var	rightAnswerIndex = 0;
var	correctAnswer = 0;
var	correctImage = '';

function startGame(){
	sound("start");
	toggleDivs('show');
	getRandomQuestion();
	stopwatch.reset();
	stopwatch.start();
}

function resetGame(){
	stopwatch.stop();
	isGameStarted = false;
	isGameEnd = false;
	isAnswerChosen = false;
	totalQuestions = 0;
	rightAnswers = 0;
	wrongAnswers = 0;
	unansweredQns = 0;
	randomQnsIndexList = [];
}

function generateUniqueQuestions(){
	while(randomQnsIndexList.length <10){
    var randomnumber = Math.ceil(Math.random()* dataBank.length-1)
    if(randomQnsIndexList.indexOf(randomnumber) > -1) 
    	continue;
    randomQnsIndexList[randomQnsIndexList.length] = randomnumber;
	}
   console.log(randomQnsIndexList);
}

function getRandomQuestion(){
	var questionIndex;

	if (randomQnsIndexList.length > 0){
		questionIndex = randomQnsIndexList.pop(randomQnsIndexList.length-1);
	}

	if(questionIndex != undefined){
		$("#div-question").html(dataBank[questionIndex].question);
		$("#choice_0").html(dataBank[questionIndex].answer[0]);
		$("#choice_1").html(dataBank[questionIndex].answer[1]);
		$("#choice_2").html(dataBank[questionIndex].answer[2]);
		$("#choice_3").html(dataBank[questionIndex].answer[3]);

		rightAnswerIndex = dataBank[questionIndex].rightAnsIndex;
		correctAnswer = dataBank[questionIndex].answer[rightAnswerIndex];
		correctImage = dataBank[questionIndex].qaURL;
	}

	totalQuestions++ ;

}

function checkAnswers(index){

	if(index === rightAnswerIndex ){

		// $('*[data-customerID="22"]');
		let idName = $('[data-index="' + index + '"]').attr('id');
		$('#' +idName).prepend("<span class='glyphicon glyphicon-ok'></span>       ");

		rightAnswers++;
			showCorrect('right');
	}else{			
		
		let idName = $('[data-index="' + index + '"]').attr('id');
		$('#' +idName).prepend("<span class='glyphicon glyphicon-remove'></span>       ");
		wrongAnswers++;
		showCorrect('wrong');
	}

	if(totalQuestions < 10){
		setTimeout(startGame, 7000);

	}else{
		showResults();	
		reset();
		resetGame();		
	}

}

function showResults(){
	sound('end');
	let results = 
	"Right Answers : " + rightAnswers + '<br>' + 
	"Wrong Answers : " + wrongAnswers + '<br>' + 
	"Unanswered Questions: " + unansweredQns; 

	//make this work in 4

	$('#myModal').modal('show');
	$('#myModal').on('shown.bs.modal', function() {
		$('#myModal').find('#resultsModal').html(results);
	});
}

function showCorrect(str){

	toggleDivs('pause');

	if(str ==='right'){
		sound('right');
		displayStatus(" YOU GOT THAT RIGHT! <img src='" + "assets/images/clap.gif" + "' width= 50 height =50>" + "<BR><BR> ", 'green');
	}else if (str === 'wrong'){
		sound('wrong');
		displayStatus(" YOU GOT THAT WRONG! <img src='" + "assets/images/wrong.gif" + "' width= 50 height =50>" + "<BR><BR> ", 'red');
	}else if (str === 'missed'){
		sound('missed');
		displayStatus(" YOU MISSED ANSWERING ! <img src='" + "assets/images/missed.gif" + "' width= 50 height =50>" + "<BR><BR> ", "red")
	}

	$('#ans-right').html('THE CORRECT ANSWER IS <BR>"' + correctAnswer + '"');
	// $('#jsImg').find('img').attr('src', '');

	$("#img-result").html("<img width='450' height= '310' src='" 
					+ correctImage
					+ "'>");
}

function displayStatus(status, color){
	$('#ans-status').html(status);
	$('#ans-status').css("color", color);
}

function updateStatus(){
	if(totalQuestions <=10){
		unansweredQns++;
		showCorrect('missed');
		setTimeout(startGame, 7000);
	}else{
		showResults();
		resetGame();
	}
}

function reset(){
	stopwatch.stop();
	totalQuestions = 0;
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


});