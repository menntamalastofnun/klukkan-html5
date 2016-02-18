$(document).ready( function () { 
	workaroundMakeMobileLinksWork();
	
	var audio = new Audio('media/audio/draga_tolur.mp3');
	audio.play();
	
    $( ".draggable" ).draggable( { 
		revert: 'invalid', 
		start: function() {
			var audio = new Audio('media/audio/num_pickup_' + getRandomInt(1,5) + '.mp3');
			audio.play();
		},
		drag: function() {
			$(this).addClass("grabbing");
			rotateDegrees($(this), 30);
			$('.droppable').css("background-color", "rgba(115, 231, 118, 0.4)");
		},
		stop:function(ev,ui){
			droppableColorsOff();
			$(this).removeClass("grabbing");
			rotateDegrees($(this), 0);
		}
	});
	
	for(var i=1; i < 13; i++) {
		/* for hours 1,2,3,..12 we make each slot accept the right hour */
		var dropspot = "#drop-spot-"+i; // find the right css selector
		var dragitem = "#drag-item-"+i;
		$( dropspot ).droppable({
			accept: dragitem, 
			drop: function( event, ui ) {
				handleDrop( this );
			}
		});
	}
	
	$('.draggable').mousedown( function() {
		$(this).css({
			"cursor": "-webkit-grabbing",
			"cursor": "-moz-grabbing",
			"cursor": "grabbing"
		});
	});
	
	$('#submit-answer').click( function() {
		if( isItFinished() ) {
			clockfaceAnimateRightAnswer();
		}
		else {
			clockfaceAnimateWrongAnswer();
		}
	});
});

function handleDrop ( target ) {
	var audio = new Audio('media/audio/num_drop_' + getRandomInt(1,5) + '.mp3');
	audio.play();

	// what element did we drop? let's remove it & and it's draggability
	var get_number_hour = $(target).attr("id").substr(-2,2);
	if (get_number_hour.substr(0,1) == "-") get_number_hour = get_number_hour.substr(1,2);
	var drop_id = "#drag-item-"+get_number_hour;
	$(drop_id).remove(); // removed
	
	$(target).css({
		"background-image": "url(media/img/"+get_number_hour+".png)",
		"background-repeat": "no-repeat",
		"background-position": "center" 
	});
	
	if ( isItFinished() ) {
		clockfaceAnimateRightAnswer();
	}
}

function isItFinished() {
	// if no more draggable elements exist: we've succeded in filling the clock:
	if( $('.draggable').length == 0 ) {	
		return true;
	}
	else {
		return false;
	}
}

function droppableColorsOff() {
	$('.droppable').css("background-color", "rgba(0,0,0,0)");
}