var turned_full_circles = 0;
var lastMinute = 0;

$(document).ready( function () {
	$('.seconds-container').hide();
	userDragClock();
	animateClockAnswers();
	
	// try to prevent ipad scrolling
	document.ontouchmove = function(e){ 
		e.preventDefault(); 
	}
});

function animateClockAnswers() {
	// if right anwswer then bounce up and down like a nodding head
	$('.right-answer').click(function() {
		$('.clock').addClass('animated bounce');
		$('.right-answer').hide();
		setTimeout(function() {
				$('.clock').removeClass('animated bounce');
				$('.right-answer').show();
			}, 2000 // tiny wait
		);
	});
	
	// if wrong anwswer then shake to sides like a head saying no
	var audio_wrong_answer = new Audio('media/audio/aejaej.mp3');
	$('.wrong-answer').click(function() {
		audio_wrong_answer.play();
		$('.clock').addClass('animated shake');
		$('.wrong-answer').hide();
		setTimeout(function() {
				$('.clock').removeClass('animated shake');
				$('.wrong-answer').show();
			}, 2000 // tiny wait
		);
	});
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
			xyToDegrees(x,y);
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
			xyToDegrees(x,y)
		}
	});
}

function xyToDegrees(x, y) { 
	// in: x,y coordinates of mouse or mobile dragging
	// out: The "degrees" the mouse is currently dragging to in a coordinate system where 12 o clock is 0 degrees and the center of the clock is (0,0)
	
	var rect = $('.clock')[0].getBoundingClientRect();
	var clock_center_x = rect.left + rect.width/2;
	var clock_center_y = rect.top + rect.height/2;
	var center = new Array(clock_center_x, clock_center_y); // center of clock
	var x_c = x - center[0];
	var y_c = center[1] - y;
	var radians = Math.atan2( x_c, y_c); 
	var degrees = radianToDegrees(radians); // these "degrees" calculate 12 o clock as 0 degrees.
	if (degrees < 0.0) {
		degrees += 360.0;
	}
	
	// To go beyond 360 degrees or below 0 degrees we need to write this here, without it we could never move the minutes more than 360 degrees, which would only allow us one hour of rotation
	var minutes = Math.floor(degrees/6); // using minutes for simplicity 
	if (50 < lastMinute && lastMinute < 60 && 0 <= minutes && minutes < 10) { // going over 12 into one hour more +
		turned_full_circles += 1;
	}
	if (50 < minutes && minutes < 60 && 0 <= lastMinute && lastMinute < 10) { // going over 12 into one hour less -
		turned_full_circles -= 1;
	}
	lastMinute = minutes;
	degrees += turned_full_circles*360;
	
	changeClocks(degrees);
}

function changeClocks(degrees) {
	var minute_degrees = Math.floor(degrees/6)*6; // just a visual bonus: using degrees that point to a minute, otherwise degrees itself is good enough.
	rotateHand($('.minutes-container'), minute_degrees);
	
	var hour_degrees = degrees/12;
	rotateHand($('.hours-container'), hour_degrees);
	
	digitalClock(degrees);
}

function digitalClock(degrees) {
	var hour = 12 + Math.floor(degrees/360);
	if (hour < 0) hour +=24;
	if (hour >= 24) hour -= 24;
	if (hour == 0) hour = "00";
	var minute = Math.floor( (degrees % 360) / 6);
	if (minute < 0 ) minute += 60;
	if (minute < 10) minute = "0" + minute;
	$('#time-is').html(hour + ":" + minute);
}