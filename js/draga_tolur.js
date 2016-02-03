$(document).ready( function () { 
    $( ".draggable" ).draggable( { 
		revert: 'invalid', 
		drag: function() {
			data = $( this ).attr('data-value');
		} 
	});
	
    $( "#drop-spot-1" ).droppable({
		accept: '#drag-item-1', 
		drop: function( event, ui ) {
			$( this )
          .find( "p" )
            .html( "Dropped!" );
		}
    });
	
	$( "#drop-spot-2" ).droppable({
		accept: '#drag-item-2', 
		drop: function( event, ui ) {
			$( this )
          .find( "p" )
            .html( "Dropped!" );
		}
    });
});