/**
    ## `Stream(state)`

    * foreach() - TODO
    * filter() - TODO
    * map() - TODO
    * zip() - TODO
**/
function Stream(f) {
    var self = getInstance(this, Stream);
    // Not sure I like this subs array hanging off the stream.
    // Is there any alternatives?
    self.subs = [];

    f(function(a) {
        self.subs.forEach(function(s) {
            s(a);
        });
    });

    return self;
}

Stream.of = function(a, b) {
    var unbinder,
        bounce;

    return new Stream(function(state) {
        unbinder = a(function() {
            bounce = b();
            if (!bounce.isDone) {
                state(bounce.thunk());
            } else {
                state(bounce.result);
                unbinder();
            }
        });
    });
};

Stream.prototype.foreach = function(f) {
    var env = this;
    return new Stream(function(state) {
        // I only subs for foreach, can I lift this out?
        env.subs.push(function(a) {
            f(a);
            state(a);
        });
    });
};

Stream.prototype.filter = function(f) {
    var env = this;
    return new Stream(function(state) {
        env.foreach(function(a) {
            if (f(a)) {
                state(a);
            }
        });
    });
};

Stream.prototype.map = function(f) {
    var env = this;
    return new Stream(function(state) {
        env.foreach(function(a) {
            state(f(a));
        });
    });
};

Stream.prototype.zip = function(s) {
    var env = this;
    var m,
        left = List.nil,
        right = List.nil;

    // This doesn't seem very functional.
    function dispatch() {
        if (left.size() > 0 && right.size() > 0) {
            m([left.car, right.car]);
            left = left.cdr;
            right = right.cdr;
        }
    }

    this.foreach(function(a) {
        left = List.cons.of(a, left);
        dispatch();
    });
    s.foreach(function(a) {
        right = List.cons.of(a, right);
        dispatch();
    });

    return new Stream(function(state) {
        m = state;
    });
};

Stream.prototype.toArray = function() {
    var accum = [];
    this.foreach(function(a) {
        accum.push(a);
    });
    return accum;
};

/**

  ## promise

      Stream.promise(promise).foreach(function (a) {
        console.log(a);
      });
**/
Stream.promise = function(p) {
    return new Stream(function(state) {
        setTimeout(function() {
            p.fork(
                function(data) {
                    state(Attempt.success(data));
                },
                function(error) {
                    state(Attempt.failure(error));
                }
            );
        }, 0);
    });
};

/**

  ## sequential

      Stream.sequential([1, 2, 3, 4]).foreach(function (a) {
        console.log(a);
      });
**/
Stream.sequential = function(v, d) {
    var index = 0;
    return Stream.poll(function() {
        if (index >= v.length - 1) return done(v[index]);
        return cont(function() {
          return v[index++];
        });
    }, d || 0);
};

/**

  ## poll

      Stream.poll(function() {
        return cont(function() {
            return bilby.method('arb', Number);
        })
      }, 0).foreach(function (a) {
        console.log(a);
      });
**/
Stream.poll = function(p, d) {
    var id;

    return Stream.of(function(handler) {
        id = setInterval(handler, d);
        return function() {
            return clearInterval(id);
        };
    }, p);
};

/**
   ## isStream(a)

   Returns `true` if `a` is `Stream`.
**/
var isStream = isInstanceOf(Stream);

bilby = bilby
  .property('Stream', Stream)
  .method('zip', isStream, function(b) {
      return a.zip(b);
  })
  .method('map', isStream, function(a, b) {
      return a.map(b);
  });
