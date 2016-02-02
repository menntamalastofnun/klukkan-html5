/*
A clock that walks.
From: cssanimation.rocks/clocks
*/

$(document).ready( function () { 
	startDigitalClock();

	// === Walking clock:
	// Initialise local time clock
	initLocalClock();
	// Start the seconds container moving
	moveSecondHand();
	// Set the intial minute hand container transition, and then each subsequent step
	setUpMinuteHand();
	
	// for smoother experience on slow loading ipad:
	$('#sidemenu a').click( function() {
		console.log("empty")
		$('#main-game-div').empty();
		$('#right-side-buttons').empty();
	});
});

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
	if (hours == "0") hours = "00";
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
      angle: (hours * 30) + (minutes / 2)
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
    var element = $('.' + hands[j].hand + "-container");
	rotateHand(element, hands[j].angle);
	// If this is a minute hand, note the seconds position (to calculate minute position later)
	if (hands[j].hand === 'minutes') {
	  // elements[k].parentNode.setAttribute('data-second-angle', hands[j + 1].angle);
	  element[0].setAttribute('data-second-angle', hands[j + 1].angle);
	}
  }
}

/*
 * Move the second containers
 */
function moveSecondHand() {
	// var container = document.querySelectorAll('.seconds-container');
	var container = $('.seconds-container');
	
	var date = new Date(); // Setting it up again (instead of sending it between)
	var seconds = date.getSeconds();	
	var angle = (seconds * 6);
	
	setInterval(function() {
		if (angle === undefined) {
			angle = 6;
		} else {
			angle += 6;
		}
		rotateHand(container, angle);
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
	rotateHand(container, container.angle); // first minute up
	// Then continue with a 60 second interval
	setInterval(function() {
		console.log(container.angle)
		if (container.angle === undefined) {
			container.angle = 12;
		} else {
			container.angle += 6;
		}
		console.log(container.angle)
		rotateHand(container, container.angle);
	}, 60000, container);
}