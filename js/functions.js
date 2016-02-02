function rotateHand(container, degrees) {
	$(container).css({
		'-webkit-transform' : 'rotateZ('+ degrees +'deg)',
		'-moz-transform'    : 'rotateZ('+ degrees +'deg)',
		'-ms-transform'     : 'rotateZ('+ degrees +'deg)',
		'-o-transform'      : 'rotateZ('+ degrees +'deg)',
		'transform'         : 'rotateZ('+ degrees +'deg)',
	});
}

function radianToDegrees (angle) {
  return angle * (180 / Math.PI);
}

// from http://stackoverflow.com/questions/8270612/get-element-moz-transformrotate-value-in-jquery 
function getRotationDegrees(obj) {
    var matrix = obj.css("-webkit-transform") ||
    obj.css("-moz-transform")    ||
    obj.css("-ms-transform")     ||
    obj.css("-o-transform")      ||
    obj.css("transform");
    if(matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    } else { var angle = 0; }
    return (angle < 0) ? angle + 360 : angle;
}

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// if right answer then bounce like a head nodding
function clockfaceAnimateRightAnswer() {
	// missing: audio for "jibby"
	$('.clock').addClass('animated bounce');
	$('.clockface-img').addClass('animated bounce');
	$('.clockface-img').attr("src","media/img/from-old/skifu-klukka-stor-happy.png");
	setTimeout(function() {
			$('.clock').removeClass('animated bounce');
			$('.clockface-img').removeClass('animated bounce');
			$('.clockface-img').attr("src","media/img/from-old/skifu-klukka-stor.png");
		}, 1000 // tiny wait
	);
}

// if wrong anwswer then shake to sides like a head saying no
function clockfaceAnimateWrongAnswer() {
	var audio_wrong_answer = new Audio('media/audio/aejaej.mp3');
	audio_wrong_answer.play();
	$('.clock').addClass('animated shake');
	$('.clockface-img').addClass('animated shake');
	$('.clockface-img').attr("src","media/img/from-old/skifu-klukka-stor-angry.png");
	setTimeout(function() {
			$('.clock').removeClass('animated shake');
			$('.clockface-img').removeClass('animated shake');
			$('.clockface-img').attr("src","media/img/from-old/skifu-klukka-stor.png");
		}, 1000 // tiny wait
	);
}

function userDragClock() { // dragging functionality:
	var isMouseDown = false;
	$(".clock")
	.mousedown(function(e) {
		isMouseDown = true;
	})
	.mousemove(function(e) {
		if(isMouseDown) {
			var x = e.pageX;
			var y = e.pageY;
			xyToDegrees(x, y);
		}
	 })
	.mouseup(function() {
		isMouseDown = false;
	});
	
	// for mobile/tablets:
	$(".clock").on("touchmove", function(ev){
		var e = ev.originalEvent;
		if(e.touches.length == 1){ // Only deal with one finger
			var touch = e.touches[0]; // Get the information for finger #1
			var x = touch.pageX;
			var y = touch.pageY;
			xyToDegrees(x, y);
		}
	});
	
	// try to prevent ipad scrolling
	document.ontouchmove = function(e){ 
		e.preventDefault(); 
	}
}

function setupClockMinuteHourHands(degrees) {
	var minute_degrees = Math.floor(degrees/6)*6; // just a visual bonus: using degrees that point to a minute, otherwise degrees itself is good enough.
	rotateHand($('.minutes-container'), minute_degrees);
	
	var hour_degrees = degrees/12;
	rotateHand($('.hours-container'), hour_degrees);
}

function clockfaceSubmitAnswer(answer_hour, answer_minutes) {
	var clockface_hour = getHourFromClockface()[0];
	var clockface_24_hour_format = getHourFromClockface()[1];
	var clockface_minutes = getMinutesFromClockface();
		
	// let's compare and check answer
	if( (answer_hour == clockface_hour || answer_hour == clockface_24_hour_format)
	&& clockface_minutes == answer_minutes ) {
		clockfaceAnimateRightAnswer();
		getNextQuestion();
	}
	else {
		clockfaceAnimateWrongAnswer();
	}
}

function getHourFromClockface() {
	var clockface_hour = Math.floor(getRotationDegrees( $('.hours-container')) / 30);
	var clockface_24_hour_format = clockface_hour + 12; 
	/* for 24 hour format, no need to do modulus 24 so it's in range [0;23] ? */
	return [clockface_hour, clockface_24_hour_format];
}

function getMinutesFromClockface() {
	return Math.floor(getRotationDegrees( $('.minutes-container')) / 6);
}