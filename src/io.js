/**
   # Input/output

   Purely functional IO wrapper.
**/

/**
   ## io(f)

   Pure wrapper around a side-effecting `f` function.

   * perform() - action to be called a single time per program
   * flatMap(f) - monadic flatMap/bind
**/
function io(f) {
    if(!(this instanceof io))
        return new io(f);

    this.perform = function() {
        return f();
    };

    this.flatMap = function(g) {
        return io(function() {
            return g(f()).perform();
        });
    };
    Do.setValueOf(this);
}

/**
   ## isIO(a)

   Returns `true` iff `a` is an `io`.
**/
var isIO = isInstanceOf(io);

bilby = bilby
    .property('io', io)
    .property('isIO', isIO)
    .method('pure', strictEquals(io), function(m, a) {
        return io(function() {
            return a;
        });
    })
    .method('flatMap', isIO, function(a, b) {
        return a.flatMap(b);
    });
