function rotateHand(container, degrees) {
	$(container).css({
		'-webkit-transform' : 'rotateZ('+ degrees +'deg)',
		'-moz-transform'    : 'rotateZ('+ degrees +'deg)',
		'-ms-transform'     : 'rotateZ('+ degrees +'deg)',
		'-o-transform'      : 'rotateZ('+ degrees +'deg)',
		'transform'         : 'rotateZ('+ degrees +'deg)',
	});
}

function radianToDegrees (angle) {
  return angle * (180 / Math.PI);
}

// from http://stackoverflow.com/questions/8270612/get-element-moz-transformrotate-value-in-jquery 
function getRotationDegrees(obj) {
    var matrix = obj.css("-webkit-transform") ||
    obj.css("-moz-transform")    ||
    obj.css("-ms-transform")     ||
    obj.css("-o-transform")      ||
    obj.css("transform");
    if(matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    } else { var angle = 0; }
    return (angle < 0) ? angle + 360 : angle;
}

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}