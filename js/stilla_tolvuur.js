$(document).ready( function () { 
	enableSettingsButton();
	$('#dialog input[type=radio]').on('change', function() {
		getNextQuestion();
	});
	
	preloadPage(); // calls preloader in functions.js & then startGame() below
});

function startGame() {
	initPreloadedImgs();
	
	workaroundMakeMobileLinksWork();

	$('.seconds-container').hide();
	var audio = new Audio('media/audio/stilla_tolvuur.mp3');
	audio.play();
	
	getNextQuestion();
	
	// fill the digital clock with user guesses
	
	$('#submit-answer').click( function() {
		var answer_hour = $('#submit-answer').attr("data-hour");
		var answer_24_hour_format = (parseInt(answer_hour) + 12) % 24;
		var answer_minutes = $('#submit-answer').attr("data-minutes");
		var user_answer = $('#cpu-clock-time-minutes').html().split(":");
		user_answer[0] = parseInt(user_answer[0]); // changing  for example 04:14 into 4:14
		// checkAnswer
		if( (user_answer[0] == answer_hour || user_answer[0] == answer_24_hour_format)
		&& answer_minutes == user_answer[1] ) {
			digitalClockAnimateRightAnswer();
			getNextQuestion();
		}
		else {
			digitalClockAnimateWrongAnswer();
		}
	});
	
	$('#next-question').click( function() { 
		getNextQuestion();
	});
	
	$('.digital-clock-input').click( function () {
		var audio = new Audio('media/audio/digi_butt_'+getRandomInt(1,4)+'.mp3');
		audio.play();
		
		var value = $(this).val();
		/* string is of the format five positions filled with "_" letters, 
		unless the positions filled with numbers from left to right */
		var string = $('#cpu-clock-time-minutes').html();
		var string_max_len = 5;
		for(var i=0; i < string_max_len; i++) {
			string = string.replace("_",""); // let's remove all _ _ _ _ _ from string
		}
		if( value === "C") { // erase
			var new_string = string.substring(0, (string.length-1) );
			while(new_string.length < string_max_len) {
				new_string = new_string.concat("_");
			}
			$('#cpu-clock-time-minutes').html(new_string);
		}
		else {
			if ( string.length < string_max_len ) {
				string = string.concat(value);
				while(string.length < string_max_len) {
					string = string.concat("_");
				}
				$('#cpu-clock-time-minutes').html(string);
			}
		}
	});
}

function getNextQuestion() {
	$('#cpu-clock-time-minutes').html("_____"); // clear user-answer box with _ _ _ _ _
	// XML with text, audio, hours, minutes:
	var settings_radio = $('#dialog :checked').attr("id");
	if (settings_radio == "radio1") {
		var filename = "times1.xml";
	}
	else {
		var filename = "times2.xml";
	}
	
	$.get(filename, function(xml){ 
		var times = $.xml2json(xml); 
		var random = getRandomInt(0, times.time.length);
		var json = times.time[random]; 
		$('#submit-answer').attr("data-hour", json.hours);
		$('#submit-answer').attr("data-minutes", json.minutes);
		var degrees = json.hours * 360 + json.minutes*6;
		setupClockMinuteHourHands(degrees)
	});
}