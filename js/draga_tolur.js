$(document).ready( function () { 
	workaroundMakeMobileLinksWork();

    $( ".draggable" ).draggable( { 
		revert: 'invalid', 
		drag: function() {
			data = $(this).attr('data-value');
			$(this).addClass("grabbing");
			rotateDegrees($(this), 30);
			$('.droppable').css("background-color", "rgba(165, 191, 168, 0.4)");
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
});

function handleDrop ( target ) {
	droppableColorsOff();
	// what element did we drop? let's see:
	var get_number_hour = $(target).attr("id").substr(-2,2);
	if (get_number_hour.substr(0,1) == "-") get_number_hour = get_number_hour.substr(1,2);
	
	var drop_id = "#drag-item-"+get_number_hour;
	// $(drop_id).draggable("destroy"); // removing the draggable functionality
	// $(drop_id).css("z-index", "100"); // still on top
	$(drop_id).remove(); // removed
	$(target).css({
		"background-image": "url(media/img/from-old/"+get_number_hour+".png)",
		"background-repeat": "no-repeat",
		"background-position": "center" 
	});
	
	// if no more draggable elements exist: we've succeded in filling the clock:
	// animate happy clock
	if( $('.draggable').length == 0 ) {	
		clockfaceAnimateRightAnswer();
	}
}

function droppableColorsOff() {
	$('.droppable').css("background-color", "rgba(0,0,0,0)");
}