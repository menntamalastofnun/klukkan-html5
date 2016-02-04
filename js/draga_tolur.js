$(document).ready( function () { 
    $( ".draggable" ).draggable( { 
		revert: 'invalid', 
		drag: function() {
			data = $( this ).attr('data-value');
			$('.droppable').css("background-color", "rgba(165, 191, 168, 0.4)");
		},
		stop:function(ev,ui){
			droppableColorsOff();
		}
	});
	
    $( "#drop-spot-1" ).droppable({
		accept: '#drag-item-1', 
		drop: function( event, ui ) {
			handleDrop( this );
		}
    });
	
	$( "#drop-spot-2" ).droppable({
		accept: '#drag-item-2', 
		drop: function( event, ui ) {
			handleDrop( this );
		}
    });
	
	$( "#drop-spot-3" ).droppable({
		accept: '#drag-item-3', 
		drop: function( event, ui ) {
			handleDrop( this );
		}
    });
});

function handleDrop ( target ) {
	$( target ).find( "p" ).html( "Dropped!" );
	droppableColorsOff();
}

function droppableColorsOff() {
	$('.droppable').css("background-color", "rgba(0,0,0,0)");
}