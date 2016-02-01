$(document).ready( function () { 
	
	// get time:
	// $('#cpu-clock-time-minutes').html()
	
	// fill the digital clock with user guesses
	$('.digital-clock-input').click( function () {
		var value = $(this).val();
		var string = $('#cpu-clock-time-minutes').html();
		if( value === "C") { // erase
			var new_string = string.substring(0, (string.length-1) );
			$('#cpu-clock-time-minutes').html(new_string);
		}
		else {
			if ( string.length < 5 )
			$('#cpu-clock-time-minutes').append(value)
		}
	});
});