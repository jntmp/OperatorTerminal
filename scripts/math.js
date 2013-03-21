Math.sum = function () {
    var result = 0, 
        i = 0;
         
    for (i; i < arguments.length; i++) {
        result += parseInt(arguments[i]);
    }

    return result;
};

Math.average = function () {
	var result = 0;
	
    if(arguments.length === 0){
        return result;
    }

    result = Math.sum.apply(this, arguments) / arguments.length;
    
    return result;
};
