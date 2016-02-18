function rotateDegrees(element, degrees) {
	$(element).css({
		'-webkit-transform' 		: 'rotateZ('+ degrees +'deg)',
		'-moz-transform'    		: 'rotateZ('+ degrees +'deg)',
		'-ms-transform'     		: 'rotateZ('+ degrees +'deg)',
		'-o-transform'      		: 'rotateZ('+ degrees +'deg)',
		'transform'         		: 'rotateZ('+ degrees +'deg)',
		"-webkit-transform-origin"	: "bottom center",
		"-moz-transform-origin"		: "bottom center",
		"transform-origin"			: "bottom center",
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
	var audio_right_answer = new Audio('media/audio/jibbi.mp3');
	audio_right_answer.play();
	$('.clockface-img').addClass('animated bounce');
	$('.droppable').remove(); // some things we only do in draga_tolur
	$('.clock').addClass('animated bounce');
	$('.clockface-img').attr("src","media/img/skifu-klukka-stor-happy.png");
	setTimeout(function() {
			$('.clock').removeClass('animated bounce');
			$('.clockface-img').removeClass('animated bounce');
			$('.clockface-img').attr("src","media/img/skifu-klukka-stor.png");
		}, 1000 // tiny wait
	);
}


// if wrong anwswer then shake to sides like a head saying no
function clockfaceAnimateWrongAnswer() {
	var audio_wrong_answer = new Audio('media/audio/aejaej.mp3');
	audio_wrong_answer.play();
	$('.clock').addClass('animated shake');
	$('.clockface-img').addClass('animated shake');
	if($('.clockface-img').attr("src") == "media/img/empty-skifu-klukka-stor.png") {
		// the clockface has no hours, this script is called from draga_tolur
		$('.clockface-img').attr("src","media/img/empty-skifu-klukka-stor-angry.png");
	}
	else {
		$('.clockface-img').attr("src","media/img/skifu-klukka-stor-angry.png");
	}
	$('.droppable').addClass("animated shake"); // only happens in draga_tolur
	setTimeout(function() {
			$('.clock').removeClass('animated shake');
			$('.clockface-img').removeClass('animated shake');
			if($('.clockface-img').attr("src") == "media/img/empty-skifu-klukka-stor-angry.png") {
				// the clockface has no hours, this script is called from draga_tolur
				$('.clockface-img').attr("src","media/img/empty-skifu-klukka-stor.png");
			}
			else {
				$('.clockface-img').attr("src","media/img/skifu-klukka-stor.png");
			}
			$('.droppable').removeClass('animated shake');
		}, 1000 // tiny wait
	);
}

// if right answer then bounce like a head nodding
function digitalClockAnimateRightAnswer() {
	var audio_right_answer = new Audio('media/audio/jibbi.mp3');
	audio_right_answer.play();
	$('#cpu-clock-time-minutes').addClass('animated bounce');
	$('.cpu-clock-img').attr("src","media/img/digitalclock-happy.png");
	$('.cpu-clock-img').addClass('animated bounce');
	
	setTimeout(function() {
			$('#cpu-clock-time-minutes').removeClass('animated bounce');
			$('.cpu-clock-img').removeClass('animated bounce');
			$('.cpu-clock-img').attr("src","media/img/tolvu-ur-stort.png");
		}, 1000 // tiny wait
	);
}

// if wrong anwswer then shake to sides like a head saying no
function digitalClockAnimateWrongAnswer() {
	var audio_wrong_answer = new Audio('media/audio/aejaej.mp3');
	audio_wrong_answer.play();
	$('#cpu-clock-time-minutes').addClass('animated shake');
	$('.cpu-clock-img').attr("src","media/img/tolvu-ur-angry.png");
	$('.cpu-clock-img').addClass('animated shake');
	setTimeout(function() {
			$('#cpu-clock-time-minutes').removeClass('animated shake');
			$('.cpu-clock-img').removeClass('animated shake');
			$('.cpu-clock-img').attr("src","media/img/tolvu-ur-stort.png");
		}, 1000 // tiny wait
	);
}

function userDragClock() { // dragging functionality:
	var isDragging = false;
	
	$(".clock")
	.mousedown(function(e) {
		isDragging = true;
		// for mouse pointer:
		$('.clock').addClass("grabbing");
		$('.clock').removeClass("grab");
		clockDraggingSound();
		
	})
	.mousemove(function(e) {
		if(isDragging) {
			var x = e.pageX;
			var y = e.pageY;
			xyToDegrees(x, y);
		}
	 })
	.mouseup(function() {
		isDragging = false;
		// for mouse pointer:
		$('.clock').addClass("grab");
		$('.clock').removeClass("grabbing");
		clockDragEndSound();
	});
	
	// for mobile/tablets:
	// (No need to add mouse-pointer: grabbing here.)
	$(".clock").on("touchstart", function() {
		clockDraggingSound();
	});
	$(".clock").on("touchmove", function(ev){
		var e = ev.originalEvent;
		if(e.touches.length == 1){ // Only deal with one finger
			var touch = e.touches[0]; // Get the information for finger #1
			var x = touch.pageX;
			var y = touch.pageY;
			xyToDegrees(x, y);
		}
	});
	$(".clock").on("touchend", function() {
		clockDragEndSound();
	});
	
	// try to prevent ipad scrolling
	document.ontouchmove = function(e){ 
		e.preventDefault(); 
	}
}

function clockDraggingSound() {
	var audio = new Audio('media/audio/clock_set_start.mp3');
	audio.addEventListener('ended', function() {
		// ideally we should play this on a loop until dragging is stopped?
		var audio_drag = new Audio('media/audio/clock_set_drag.mp3');
		audio_drag.play();
	});
	audio.play();
}

function clockDragEndSound() {
	var audio = new Audio('media/audio/clock_set_stop.mp3');
	audio.play();
}

function setupClockMinuteHourHands(degrees) {
	var minute_degrees = Math.floor(degrees/6)*6; // just a visual bonus: using degrees that point to a minute, otherwise degrees itself is good enough.
	rotateDegrees($('.minutes'), minute_degrees);
	
	var hour_degrees = degrees/12;
	rotateDegrees($('.hours'), hour_degrees);
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
	var clockface_hour = Math.floor(getRotationDegrees( $('.hours')) / 30);
	var clockface_24_hour_format = clockface_hour + 12; 
	/* for 24 hour format, no need to do modulus 24 so it's in range [0;23] ? */
	return [clockface_hour, clockface_24_hour_format];
}

function getMinutesFromClockface() {
	return Math.floor(getRotationDegrees( $('.minutes')) / 6);
}

function workaroundMakeMobileLinksWork() {
	/*  make links easier to click on in the tablets (note: we should also do this for buttons)
	So links work properly when a user intends to click on a link,
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

function enableSettingsButton() {
	$('#dialog').hide(); // funny that this is needed
	$('#settings').click(function() {
		$('#dialog').dialog(); // jquery ui dialog go go go
	});
	$('#settings-radio-buttonset1').buttonset(); // give more descriptive DIV name. 
	$('#settings-radio-buttonset2').buttonset(); // give more descriptive DIV name. 
}