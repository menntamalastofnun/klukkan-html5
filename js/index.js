/*
A clock that walks.
Parts of code are from: cssanimation.rocks/clocks
*/

$(document).ready( function () { 
	enableSettingsButton();
	
	preloadPage(); // calls preloader in functions.js & then startGame() below
});

function startGame() {
	initPreloadedImgs();
	
	workaroundMakeMobileLinksWork();

	startDigitalClock();

	// === Walking clock:
	// Initialise local time clock
	initLocalClock();
	
	// Start the seconds container moving
	moveSecondHand();
	// Set the initial minute hand container transition, and then each subsequent step
	setUpMinuteHand();
	
	playClockTikTok();
}

function playClockTikTok() {
	soundManager.play('clock_tick_'+getRandomInt(0,6), {
		onfinish: function() {
			playClockTikTok(); // omg I'm thinking in recursive
		}
	});
}

function startDigitalClock() {
  $('#cpu-clock-time-seconds').html(getDigitalTimeString());
  setInterval(function() {
		$('#cpu-clock-time-seconds').html(getDigitalTimeString());
	}, 1000);
}

function getDigitalTimeString() { // let's get a HH:MM:SS timestring
	var date = new Date();
	
	var seconds = date.getSeconds();
	var minutes = date.getMinutes();
	var hours = date.getHours();
	
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	if (String(hours).length == 1) hours = "0" + hours; // from 00, 01, .. to 23
	return hours+":"+minutes+":"+seconds;
}

// Sets up a clock using the user's local time
function initLocalClock() {
  // Get the local time using JS
  var date = new Date;
  var seconds = date.getSeconds();
  var minutes = date.getMinutes();
  var hours = date.getHours();

  // Create an object with each hand and it's angle in degrees
  var hands = [
    {
      hand: 'hours',
      angle: ((hours * 30) + (minutes / 2))
    },
    {
      hand: 'minutes',
      angle: (minutes * 6)
    },
    {
      hand: 'seconds',
      angle: (seconds * 6)
    }
  ];
  
  // Loop through each of these hands to set their angle
  for (var j = 0; j < hands.length; j++) {
    var element = $('.' + hands[j].hand);
	rotateDegrees(element, hands[j].angle);
	// If this is a minute hand, note the seconds position (to calculate minute position later)
	if (hands[j].hand === 'minutes') {
	  // elements[k].parentNode.setAttribute('data-second-angle', hands[j + 1].angle);
	  $('.minutes-container')[0].setAttribute('data-second-angle', hands[j + 1].angle);
	}
  }
}

/*
 * Move the second containers
 */
function moveSecondHand() {
	var date = new Date(); // Setting it up again (instead of sending it between)
	var seconds = date.getSeconds();	
	var angle = (seconds * 6);
	
	setInterval(function() {
		if (angle === undefined) {
			angle = 6;
		} else {
			angle += 6;
		}
		var element = $('.seconds');
		rotateDegrees(element, angle);
	}, 1000);
}

/*
 * Set a timeout for the first minute hand movement (less than 1 minute), then rotate it every minute after that
 */
function setUpMinuteHand() {
  // Find out how far into the minute we are
  var container = $('.minutes-container');
  var secondAngle = container[0].getAttribute("data-second-angle");
  if (secondAngle > 0) {
    // Set a timeout until the end of the current minute, to move the hand
    var delay = (((360 - secondAngle) / 6) + 0.1) * 1000;
    setTimeout(function() {
      moveMinuteHand(container);
    }, delay);
  }
}

/*
 * Do the first minute's rotation
 */
function moveMinuteHand(container) {
	var date = new Date(); // Setting it up again (instead of sending it between)
	var minutes = date.getMinutes();
	container.angle = (minutes * 6);
	rotateDegrees( $('.minutes'), container.angle); // first minute up
	// Then continue with a 60 second interval
	setInterval(function() {
		console.log(container.angle)
		if (container.angle === undefined) {
			container.angle = 12;
		} else {
			container.angle += 6;
		}
		rotateDegrees( $('.minutes'), container.angle);
	}, 60000, container);
}