
$(document).ready( function () { 
	
	// XML with text, audio, hours, minutes:
	$.get('times1.xml', function(xml){ 
		var times = $.xml2json(xml); 
		var random = getRandomInt(0, times.time.length);
		var json = times.time[random]; 
		$('#read-time-text').html(json.text[0]);
		var audio = new Audio('media/' + json.audio);
		audio.play();
		console.log(json.hours + ":" + json.minutes);
	});
	
});