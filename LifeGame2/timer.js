function Timer (trigger, interval){
	this.trigger = trigger;
	this.interval = interval;
	var that = this;
	this.start = function(){
		that.loop = setInterval(trigger, interval); 
	}
	this.stop = function(){
		clearInterval(that.loop);
	}
}