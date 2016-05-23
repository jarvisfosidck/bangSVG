CollectionSS = function() {
	return this;
}
CollectionSS.prototype.len = function() {
	return Object.keys(this).length;//gives length property to object
}
SelectionSet = function(svg) {
	this.collection = new CollectionSS;
	this.svg = svg;
	this.add = function(o) {
		var cnt = this.collection.len();
		this.collection[cnt] = o;
		o.selectionSetID = "ssid__" + cnt;//an uID for the element
		return o;
	}
	this.remove = function(o) {//removes the object from the collection
		var id = o.selectionSetID, oo = new CollectionSS;
		for (var i=0,len=this.collection.len();i<len;i++) {
			if (o[i].selectionSetID !== id) {
				oo[i] = o[i];//the collection index updates, but the ssid doesn't
			} else {
				this.svg.removeChild(o);
			}
		}
		return this.collection = oo;
	}
	this.removeAll = function() {

		for (var i=0,len=this.collection.len();i<len;i++) {
			this.svg.removeChild(this.collection[i]);
		}
		this.collection = new CollectionSS;
		return true;
	}
}
