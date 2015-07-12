function $(arg){
	if (typeof arg != 'string') return null;
	
	function attr(){
		if (arguments.length == 0) return undefined;
		if (arguments.length == 1){
			if (arguments[0] in this) return this[arguments[0]];
			else return undefined;
		}
		else if (arguments.length == 2){
			this[arguments[0]] = arguments[1];
		}
		else return undefined;
	}
	
	var ret;
	
	if (arg[0] == '#'){
		ret = document.getElementById(arg.substring(1));
		if (ret != null) ret.attr = attr;
		return ret;
	}
	else if (arg[0] == '.'){
		ret = document.getElementsByClassName(arg.substring(1));
	}
	else{
		ret = document.getElementsByTagName(arg);
	}
	
	if (ret == null) return null;
	if (ret.length == 0) return null;
	
	for (var i = 0; i < ret.length; i ++) ret[i].attr = attr;
	if (ret.length == 1) return ret[0];
	return ret;
}

