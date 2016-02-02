$(document).ready( function () { 
	$('.seconds-container').hide();
	var audio = new Audio('media/audio/stilla_tolvuur.mp3');
	audio.play();
	
	getNextQuestion();
	
	// fill the digital clock with user guesses
	
	$('#submit-answer').click( function() {
		var answer_hour = $('#submit-answer').attr("data-hour");
		var answer_24_hour_format = answer_hour + 12;
		/* for 24 hour format, no need to do modulus 24 so it's in range [0;23] ? */
		var answer_minutes = $('#submit-answer').attr("data-minutes");
		var user_answer = $('#cpu-clock-time-minutes').html().split(":");
		// checkAnswer
		// animateCPUclock
		
		/* similar to this:: 
		if( (answer_hour == clockface_hour || answer_hour == clockface_24_hour_format)
		&& clockface_minutes == answer_minutes ) {
			clockfaceAnimateRightAnswer();
			getNextQuestion();
		}
		else {
			clockfaceAnimateWrongAnswer();
		}
		*/
	});
	
	$('#next-question').click( function() { 
		getNextQuestion();
	});
	
	$('.digital-clock-input').click( function () {
		var value = $(this).val();
		var string = $('#cpu-clock-time-minutes').html();
		if( value === "C") { // erase
			var new_string = string.substring(0, (string.length-1) );
			$('#cpu-clock-time-minutes').html(new_string);
		}
		else {
			if ( string.length < 5 )
			$('#cpu-clock-time-minutes').append(value)
		}
	});
});

function getNextQuestion() {
	// XML with text, audio, hours, minutes:
	$.get('times1.xml', function(xml){ 
		var times = $.xml2json(xml); 
		var random = getRandomInt(0, times.time.length);
		var json = times.time[random]; 
		$('#submit-answer').attr("data-hour", json.hours);
		$('#submit-answer').attr("data-minutes", json.minutes);
		var degrees = json.hours * 360 + json.minutes*6;
		setupClockMinuteHourHands(degrees)
	});
}