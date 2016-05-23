eventHandler = function() {
	"use strict";

	this.clickStack = [];
	this.eventStack = [];
	this.moveStack = [];

	this.listen = function(e,evt) {
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
		this.createCase(e);
	}
	this.createCase = function(e) {
		var cCase = {
			'e1' : {
				 'x' : e.clientX
				,'y' : e.clientX
				,'name' : e.target
			}
		}
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
