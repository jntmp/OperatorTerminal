
var calc = {

    // main entry point
    run: function (input, options) {
		
        var queue = this.prepare(input);
		
		// fail early if 'strict'
		if(options.strict && queue[1].length > 0){
			this.eject(options, null, queue[1]);
			return;
		}
        
        var result = this.process(queue[0]);

        this.eject(options, result);
    },
    
    // extract and validate data from input
    prepare: function(input){
		var lines = input.split('\n'),
			queue = [],
			err = [],
			i = 0;
		
		// trim empty, null, undefined array values
		lines = lines.trim();

		// loop and split data
        for (i; i < lines.length; i++) {
            
            var exp = this.validate(lines[i]);
            
			// list error for later
            if(exp.Status.length > 0){
                err.push(exp.Status);
			}
			
            // queue each item for processing
            queue.push(exp);
        }
        
        return [queue, err];
    },
    
    // apply specified functions to each input line
    process: function(queue){
		var result = [],
			q = 0;
		
		// start processing queue
        for (q; q < queue.length; q++) {
            var r, qItem = queue[q];
			
            // if no error on expression
            if(qItem.Status.length === 0){
            	// execute the operator 
            	var method = qItem.Method.toLowerCase();
                r = Math[method].apply(this, qItem.Data);

                // list result
                result.push(resources.en.templ.result.format(qItem.No, qItem.Method, r));
            }
            else {
            	// list error
                result.push(resources.en.templ.result.format(qItem.No, qItem.Method, qItem.Status));
            }
        }
        
        return result;
    },
    
    // invoke callback based on options
    eject: function(options, result, err){
		
		if (options) {
			if(typeof (options.complete) === "function") {
				if(err){
					options.complete(result, err);
				}
				else{
					options.complete(result);
				}
            }
        }
        
		return err ? err : result;
        
    },
    
    validate: function(inputLine){
		
        var errs = [];
        
        // split fields and trim
        var exprArr = inputLine.split(/#-|:\s|:|,/g);
        
        // trim empty, null, undefined array values
        exprArr = exprArr.trim();

        // object to bind
        var exp = {};

        if(exprArr.length < 2){
            exp.Status = resources.en.errors.invalidSyntax;
            return exp;
        }
        
        // bind properties
        exp.No = parseInt(exprArr[0]);
        exp.Method = exprArr[1];
        exp.Data = exprArr.slice(2);
        
        // validate
        // line no
		if(isNaN(exp.No)){
			exp.No = " ";
            errs.push(resources.en.errors.invalidLineNo.format(exprArr[0]));
		}
			
        // operator name
		if(exp.Method.length > 0 && !Math.hasOwnProperty(exp.Method.toLowerCase())){
			errs.push(resources.en.errors.invalidOperator.format(exprArr[1]));
		}
		
        // parameters
		if(!exp.Data || exp.Data.length === 0){
			errs.push(resources.en.errors.invalidParams);
		}
		else{
			// verify all params are valid numbers
			var f = exp.Data.filter(function(a){ return !isNaN(a); });

			if(f.length != exp.Data.length){
				errs.push(resources.en.errors.invalidParams);
			}
		}
		
        exp.Status = errs.length > 0 ? errs.join('; ') : '';
		
        return exp;
    }
}

