var common = {
    get: function (id) {
        return document.getElementById(id);    
    }
};

String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+(i)+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

Array.prototype.trim = function() {
    return this.filter(function(a){return a});
};