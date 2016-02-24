/*
A clock that walks.
Parts of code are from: cssanimation.rocks/clocks
*/

$(document).ready( function () { 
	enableSettingsButton();
	
	preloadPage();
});

function preloadPage() {
	$('#maingame-container').hide();

	soundManager.onready( function() {
		var loader = new PxLoader();
		
		// images to preload:
		var PRELOAD_IMG_BTN = new Array();
		for(i = 0; i<5; i++ ) {
			PRELOAD_IMG_BTN[i] = loader.addImage('media/img/button'+(i+1)+'.png');
		}
		var PRELOAD_IMG_LOGO = loader.addImage('media/img/logo/logo_bw.png');
		var PRELOAD_IMG_CPU_CLOCK = loader.addImage('media/img/tolvu-ur-stort.png');
		var PRELOAD_IMG_CLOCKFACE = loader.addImage('media/img/skifu-klukka-stor.png');
		// sounds to preload:
		var PRELOAD_SOUNDS_TIKTOK = new Array();
		for (i = 0; i<6; i++) {
			// tiktok+i is used as the SoundManager2 soundID here:
			PRELOAD_SOUNDS_TIKTOK[i] = loader.addSound('tiktok'+i, 'media/audio/clock_tick_'+(i+1)+'.mp3') 
		}
		
		// callback that runs every time an image/sound loads 
		loader.addProgressListener(function(e) { 
			// the event provides stats on the number of completed items 
			var percent_completed = Math.floor(100*(e.completedCount / e.totalCount));
			changeLoaderPercentage( percent_completed );
		}); 

		// callback that will be run once every item is ready 
		loader.addCompletionListener(function() { 
			$('#maingame-container').show();
			$('#loading-container').hide();
			// let's put our images in their places
			// REWRITE: more elegant code to somehow loop through all loaded images and storing the css selector with them in the lines above.
			for(i = 0; i<5; i++) {
				$('#img-btn'+(i+1)).attr("src", $(PRELOAD_IMG_BTN[i]).attr("src"));
			}
			$('.clockface-img').attr("src", $(PRELOAD_IMG_CLOCKFACE).attr("src"));
			$('.cpu-clock-img').attr("src", $(PRELOAD_IMG_CPU_CLOCK).attr("src"));
			$('#mms-logo').attr("src", $(PRELOAD_IMG_LOGO).attr("src"));
			
			startGame();
		}); 
		
		// begin downloading images + sounds
		loader.start(); 
	});
}

function startGame() {
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
	soundManager.play('tiktok'+getRandomInt(0,6), {
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