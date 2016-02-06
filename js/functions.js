function rotateDegrees(container, degrees) {
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
	$('.droppable').addClass("animated bounce"); // only happens in draga_tolur
	setTimeout(function() {
			$('.clock').removeClass('animated bounce');
			$('.clockface-img').removeClass('animated bounce');
			$('.clockface-img').attr("src","media/img/from-old/skifu-klukka-stor.png");
			$('.droppable').removeClass('animated bounce');
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

// if right answer then bounce like a head nodding
function digitalClockAnimateRightAnswer() {
	// missing: audio for "jibby"
	$('#cpu-clock-time-minutes').addClass('animated bounce');
	$('.cpu-clock-img').addClass('animated bounce');
	// $('.clockface-img').attr("src","media/img/from-old/skifu-klukka-stor-happy.png");
	setTimeout(function() {
			$('#cpu-clock-time-minutes').removeClass('animated bounce');
			$('.cpu-clock-img').removeClass('animated bounce');
			// $('.clockface-img').attr("src","media/img/from-old/skifu-klukka-stor.png");
		}, 1000 // tiny wait
	);
}

// if wrong anwswer then shake to sides like a head saying no
function digitalClockAnimateWrongAnswer() {
	var audio_wrong_answer = new Audio('media/audio/aejaej.mp3');
	audio_wrong_answer.play();
	$('#cpu-clock-time-minutes').addClass('animated shake');
	$('.cpu-clock-img').addClass('animated shake');
	// $('.clockface-img').attr("src","media/img/from-old/skifu-klukka-stor-happy.png");
	setTimeout(function() {
			$('#cpu-clock-time-minutes').removeClass('animated shake');
			$('.cpu-clock-img').removeClass('animated shake');
			// $('.clockface-img').attr("src","media/img/from-old/skifu-klukka-stor.png");
		}, 1000 // tiny wait
	);
}

function userDragClock() { // dragging functionality:
	var isMouseDown = false;
	$(".clock")
	.mousedown(function(e) {
		isMouseDown = true;
		// for mouse pointer:
		$('.clock').addClass("grabbing");
		$('.clock').removeClass("grab");
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
		// for mouse pointer:
		$('.clock').addClass("grab");
		$('.clock').removeClass("grabbing");
	});
	
	// for mobile/tablets:
	// (No need to add mouse-pointer: grabbing here.)
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
	rotateDegrees($('.minutes-container'), minute_degrees);
	
	var hour_degrees = degrees/12;
	rotateDegrees($('.hours-container'), hour_degrees);
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

function workaroundMakeMobileLinksWork() {
	/* Mobile work-around: So links work properly when a user intends to click on a link,
	but ends up dragging it ("touchmove"), then we check if "touchend" is on the link 
	 */
	$('a').on('click touchend', function(e) {
		var el = $(this);
		var link = el.attr('href');
		/* doesn't work: 
		el.css("background-color","rgba(100,150,100,1)");
		-- was intending to make the sidemenu links work better
		*/
		window.location = link;
	});
}