/*
 *  Main function to set the clock times
 */
$(document).ready( function () {

	/*
	// ===============
	// Clock that walks: 
	// Initialise any local time clocks
	initLocalClocks();
	// Start the seconds container moving
	moveSecondHands();
	// Set the intial minute hand container transition, and then each subsequent step
	setUpMinuteHands();
	// ===============
	*/

	
	// So user can drag clock:
	$('.seconds-container').hide();

	userDragClock();
	
});

	var turned_full_circles = 0;
	var lastMinute = 0;

function userDragClock() {
	
	/*
	
	var ekki að gefa mér mousepos þegar hann var að dragga...
	
	$(".container")
	.mousedown(function(e) {
		// we're dragging until it's up
		intervalId = setInterval(draggingMessage, 500, e, $(this) ); // even with e and this didn't give me mousepos 
		
		// click debug message
		var offset = $(this).offset();
		var x = e.pageX - offset.left;
		var y = e.pageY - offset.top;
		console.log("click (x,y) = (" + x + " , " + y + ")" );
	})
	.mouseup(function() {
		clearInterval(intervalId); // stopped dragging
	});
	
	// .... i had this function outside of the userdragclock function but whatever:
	function draggingMessage( e , clickedThing) {
		console.log("We're dragging still! Dragging on!");
		var offset = clickedThing.offset();
		var x = e.pageX - offset.left;
		var y = e.pageY - offset.top;
		console.log("drag (x,y) = (" + x + " , " + y + ")" );
	}
	*/
	
	
	var isMouseDown = false;
	$(".container")
	.mousedown(function(e) {
		isMouseDown = true;
	})
	.mousemove(function(e) {
		if(isMouseDown) {
			var offset = $(this).offset();
			var x = e.pageX - offset.left;
			var y = e.pageY - offset.top;
			// console.log("drag (x,y) = (" + x + " , " + y + ")" );
			xyToMinutes(x,y);
		}
	 })
	.mouseup(function() {
		isMouseDown = false;
	});
	
	
	// for mobile: 
	$(".container").on("touchmove", function(ev){
		var e = ev.originalEvent;
		if(e.touches.length == 1){ // Only deal with one finger
			var touch = e.touches[0]; // Get the information for finger #1
			var node = touch.target; // Find the node the drag started from
			// console.log(node) // hard to hit the small things of the clock...
			var x = touch.pageX;
			var y = touch.pageY;
			// console.log("something x, y = ("+ x + " , " + y +")");
			xyToMinutes(x,y)
		}
	});
	
	
	
	
	// ok center for both is roughly 320,320 at the moment.
	
	
	/* tried something for mobile but nahhhh do it differently
	
	var isMouseDown = false;
	$(".container")
	.bind("mousedown touchstart", function(e) {
		isMouseDown = true;
	})
	.bind("mousemove touchmove", function(e) {
		if(isMouseDown) {
			var offset = $(this).offset();
			var x = e.pageX - offset.left;
			var y = e.pageY - offset.top;
			console.log("drag (x,y) = (" + x + " , " + y + ")" );
		}
	 })
	.bind("mouseup touchend", function() {
		isMouseDown = false;
	});
	
	*/
	
}

function xyToMinutes(x, y) { // notum minute actually ekkert atm
	// in: x,y coordinates of mouse or mobile dragging
	// out: The minute the mouse is currently dragging to
	
	// x,y changed into 360 degrees considering the center of roughly 320,320
	// 360 changed into minutes by /6
	var center = new Array(320, 320);
	var x_c = x - center[0];
	var y_c = center[1] - y;
	var radians = Math.atan2( x_c, y_c); 
	var degrees = toDegrees(radians); // these "degrees" calculate 12 o clock as 0 degrees.
	if (degrees < 0.0) {
		degrees += 360.0;
	}
	
	var minutes = Math.floor(degrees/6); // notum minute actually ekkert at the moment really.
	
	if (50 < lastMinute && lastMinute < 60 && 0 <= minutes && minutes < 10) { // fórum yfir klukkustundarmarkið í +
		turned_full_circles += 1;
	}
	if (50 < minutes && minutes < 60 && 0 <= lastMinute && lastMinute < 10) { // fórum yfir klukkustundarmarkið í -
		turned_full_circles -= 1;
	}
	lastMinute = minutes;
	degrees += turned_full_circles*360;
	
	dragMinuteHand(degrees);
	dragHourHand(degrees);
	clockIs(degrees);
}

function toDegrees (angle) {
  return angle * (180 / Math.PI);
}

function dragMinuteHand(degrees) {	
	degrees = Math.floor(degrees/6)*6; // just a visual bonus: using degrees that point to a minute 
	$('.minutes-container').css({
		'-webkit-transform' : 'rotateZ('+ degrees +'deg)',
		'-moz-transform'    : 'rotateZ('+ degrees +'deg)',
		'-ms-transform'     : 'rotateZ('+ degrees +'deg)',
		'-o-transform'      : 'rotateZ('+ degrees +'deg)',
		'transform'         : 'rotateZ('+ degrees +'deg)',
	});
}

function dragHourHand(degrees) {
	degrees = degrees/12;
	$('.hours-container').css({
		'-webkit-transform' : 'rotateZ('+ degrees +'deg)',
		'-moz-transform'    : 'rotateZ('+ degrees +'deg)',
		'-ms-transform'     : 'rotateZ('+ degrees +'deg)',
		'-o-transform'      : 'rotateZ('+ degrees +'deg)',
		'transform'         : 'rotateZ('+ degrees +'deg)',
	});
}

function clockIs(degrees) {
	var hour = 12 + Math.floor(degrees/360);
	if (hour < 0) hour +=24;
	if (hour >= 24) hour -= 24;
	if (hour == 0) hour = "00";
	var minute = Math.floor( (degrees % 360) / 6);
	if (minute < 0 ) minute += 60;
	if (minute < 10) minute = "0" + minute;
	$('#time-is').html(hour + ":" + minute);
}


/*
 * Starts any clocks using the user's local time
 */
/*
 * Starts any clocks using the user's local time
 * From: cssanimation.rocks/clocks
 */
function initLocalClocks() {
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
  // console.log(document.querySelectorAll('.minutes'))
  // Loop through each of these hands to set their angle
  for (var j = 0; j < hands.length; j++) {
    var elements = document.querySelectorAll('.' + hands[j].hand);
	// console.log(elements)
    for (var k = 0; k < elements.length; k++) {
        elements[k].style.webkitTransform = 'rotateZ('+ hands[j].angle +'deg)';
        elements[k].style.transform = 'rotateZ('+ hands[j].angle +'deg)';
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
function moveSecondHands() {
  var containers = document.querySelectorAll('.seconds-container');
  setInterval(function() {
    for (var i = 0; i < containers.length; i++) {
      if (containers[i].angle === undefined) {
        containers[i].angle = 6;
      } else {
        containers[i].angle += 6;
      }
      containers[i].style.webkitTransform = 'rotateZ('+ containers[i].angle +'deg)';
      containers[i].style.transform = 'rotateZ('+ containers[i].angle +'deg)';
    }
  }, 1000);
}

/*
 * Set a timeout for the first minute hand movement (less than 1 minute), then rotate it every minute after that
 */
function setUpMinuteHands() {
  // Find out how far into the minute we are
  var containers = document.querySelectorAll('.minutes-container');
  var secondAngle = containers[0].getAttribute("data-second-angle");
  if (secondAngle > 0) {
    // Set a timeout until the end of the current minute, to move the hand
    var delay = (((360 - secondAngle) / 6) + 0.1) * 1000;
    setTimeout(function() {
      moveMinuteHands(containers);
    }, delay);
  }
}

/*
 * Do the first minute's rotation
 */
function moveMinuteHands(containers) {
  for (var i = 0; i < containers.length; i++) {
    containers[i].style.webkitTransform = 'rotateZ(6deg)';
    containers[i].style.transform = 'rotateZ(6deg)';
  }
  // Then continue with a 60 second interval
  setInterval(function() {
    for (var i = 0; i < containers.length; i++) {
      if (containers[i].angle === undefined) {
        containers[i].angle = 12;
      } else {
        containers[i].angle += 6;
      }
      containers[i].style.webkitTransform = 'rotateZ('+ containers[i].angle +'deg)';
      containers[i].style.transform = 'rotateZ('+ containers[i].angle +'deg)';
    }
  }, 60000);
}