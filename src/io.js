function io(f) {
    if(!(this instanceof io))
        return new io(f);

    this.perform = function() {
        return f();
    };

    this.bind = function(g) {
        return io(function() {
            return g(f()).perform();
        });
    };
    Do.setValueOf(this);
}

var isIO = isInstanceOf(io);

bilby = bilby
    .property('io', io)
    .property('isIO', isIO)
    .method('pure', strictEquals(io), function(m, a) {
        return io(function() {
            return a;
        });
    })
    .method('>=', isIO, function(a, b) {
        return a.bind(b);
    });
