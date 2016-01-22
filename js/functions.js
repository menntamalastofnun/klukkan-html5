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