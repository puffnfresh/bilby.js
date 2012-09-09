// Gross mutable global
var doQueue;

// Boilerplate
function Do() {
    if(arguments.length)
        throw new TypeError("Arguments given to Do. Proper usage: Do()(arguments)");

    var env = this,
        oldDoQueue = doQueue;

    doQueue = [];
    return function(n) {
        var op, x, i;
        if(!doQueue.length) {
            doQueue = oldDoQueue;
            return n;
        }

        if(n === true) op = '>=';
        if(n === false) op = '>';
        if(n === 0) op = '>>';
        if(n === 1) op = '*';
        if(n === doQueue.length) op = '+';

        if(!op) {
            doQueue = oldDoQueue;
            throw new Error("Couldn't determine Do operation. Could be ambiguous.");
        }

        x = doQueue[0];
        for(i = 1; i < doQueue.length; i++) {
            x = env[op](x, doQueue[i]);
        }

        doQueue = oldDoQueue;
        return x;
    };
}
Do.setValueOf = function(proto) {
    var oldValueOf = proto.valueOf;
    proto.valueOf = function() {
        if(doQueue === undefined)
            return oldValueOf.call(this);

        doQueue.push(this);
        return 1;
    };
};

bilby = bilby.property('Do', Do);
