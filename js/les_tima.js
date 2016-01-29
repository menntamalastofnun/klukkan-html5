
$(document).ready( function () { 
	
	
	
	// XML með texta, tíma og hljóði
	$.get('times1.xml', function(xml){ 
		var times = $.xml2json(xml); 
		console.log(times.time[0].minutes);
	});
	
});

console.log("derp")