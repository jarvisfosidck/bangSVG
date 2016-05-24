eventCollection = function() {
	this.previousEvent = false;
	this.current = false;
	this.set = [];
	this.maxLength = 200;
	return this;
}
eventCollection.prototype.get = function(e) {
	return this.set;
}
eventCollection.prototype.add = function(e) {
	if (this.current) {
		this.previousEvent = this.current;
	}
	if (this.set.length > this.maxLength) {
		this.enforeMax(this.maxLength);
	}
	var a = {
		 'x' : e.clientX || false
		,'y' : e.clientY || false
		,'el' : e.target || false
		,'offset' : this.currentOffset
		,'charCode' : e.charCode || false
		,'keyCode' : e.keyCode || false
		,'vh' : false
	}
	if (a.x && this.previousEvent && this.previousEvent.x) {
		a.vh = this.vectorHeading(a,this.previousEvent);
	}
	this.current = a;
	this.set.unshift(a);
}
eventCollection.prototype.vectorHeading = function(d1,d2) {
	var dx = d2.x - d1.x
	 	,dy = d2.y - d1.y;
		if (dx != 0 && dy != 0) {
			return Math.sign(parseInt(dx,10)) + "," + Math.sign(parseInt(dy,10));
		} else {
			return "";
		}
}
eventCollection.prototype.enforeMax = function(max) {
	cnt=parseInt(max/2,10);
	this.set = this.set.splice(0,cnt);
}
eventCollection.prototype.remove = function(o) {
	var ns = {}
	if (Number.isInteger(o)) {
		for (var x in this.set) {
			if (x !== o) {
				ns[x] = this.set[x];
			}
		}
	} else {
		for (var x in this.set) {
			if (x !== o.offset) {
				ns[x] = this.set[x];
			}
		}
	}
	this.set = ns;
}


eventHandler = function() {
	"use strict";

	this.clickStack = [];
	this.eventStack = new eventCollection;
	this.moveStack = [];

	this.listen = function(e,evt) {
		this.eventStack.add(e,evt);

		this.findGesture(this.eventStack.get());

		if (["CLICK", "DBLCLICK"].indexOf(evt) !== -1) {
			this.clickStack.unshift(evt);
			var cS = this.clickStack;
			if (cS[1] === 'DBLCLICK' && cS[0] === 'CLICK' && cS[2] === 'CLICK') {//after second double click do this
				this.params.eventPatterns.bangSaveToModel();
			}
		}
		if (["MOUSEDOWN", "MOUSEMOVE", "MOUSEOUT"].indexOf(evt) !== -1) {
			this.moveStack.push(evt);
			var mS = this.moveStack.join(",");
			var re = /MOUSEDOWN(,MOUSEMOVE){5,},MOUSEOUT$/;
			if (re.test(mS)) {
				this.params.eventPatterns.clearLastBang();
				this.moveStack = [];

			}
		}
	}
	this.findGesture = function(stack) {
		stack = stack || this.eventStack.get();
		var c = stack,s = "";
		for (var x in c) {
			if (c[x].vh != "") {
				s += " " + c[x].vh;
			}
		}
		var clockwiseRE = /( 1,1){1,}( 1,-1){1,}( -1,-1){1,}( -1,1){1,}/;
		if (clockwiseRE.test(s)) {
			console.log('we found a circle');
		}

	}
	this.getStack = function() {
		console.log(this.eventStack);
	}
	this.report = function(o) {
		for (var x in this.clickStack) {
			if (o) {
				console.log(this.clickStack[x].o);
			} else {
				console.log(this.clickStack[x]);
			}
		}
	}
	this.init = function(params) {
		var el = document.getElementsByTagName('body')[0]
		,that = this;
    	this.params = params;
		["CLICK", "DBLCLICK", "KEYDOWN", "KEYUP", "KEYPRESS", "MOUSEDOWN", "MOUSEMOVE", "MOUSEUP", "MOUSEOUT"].forEach(function(ev) {
			el.addEventListener(ev.toLowerCase(), function(e) {
				that.listen(e,ev);
			})
		});
		return true;
	}
}
