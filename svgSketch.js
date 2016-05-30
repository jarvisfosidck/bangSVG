
function _(id) {
  return document.getElementById(id);
}

function _circ(svg,attrs) {
	var c = document.createElementNS(xmlns,"circle")
	for (var a in attrs) {
		c.setAttributeNS(null, a,attrs[a]);
	}
	return c;
}
