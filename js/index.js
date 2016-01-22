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
});

function startDigitalClock() {
  $('#time-is').html(getDigitalTimeString());
  setInterval(function() {
		$('#time-is').html(getDigitalTimeString());
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
    var elements = $('.' + hands[j].hand);
    for (var k = 0; k < elements.length; k++) {
		rotateHand(elements[k], hands[j].angle);
        // If this is a minute hand, note the seconds position (to calculate minute position later)
        if (hands[j].hand === 'minutes') {
          elements[k].parentNode.setAttribute('data-second-angle', hands[j + 1].angle);
        }
    }
  }
}

/*
 * Move the second containers
 */
function moveSecondHand() {
	// var container = document.querySelectorAll('.seconds-container');
	var container = $('.seconds-container');
	setInterval(function() {
		if (container.angle === undefined) {
			container.angle = 6;
		} else {
			container.angle += 6;
		}
		rotateHand(container, container.angle);
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
	rotateHand(container, 6); // 6 degrees rotation
	// Then continue with a 60 second interval
	setInterval(function() {
		if (container.angle === undefined) {
			container.angle = 12;
		} else {
			container.angle += 6;
		}
		rotateHand(container, container.angle);
	}, 60000);
}