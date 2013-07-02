/**
    ## `Stream(state)`

    * concat(b) - TODO
    * empty() - TODO
    * foreach(f) - TODO
    * filter(f) - TODO
    * map(f) - TODO
    * zip(s) - TODO
**/
function Stream(f) {
    var self = getInstance(this, Stream);

    var resolver;
    self.promise = new Promise(function(resolve, reject) {
        resolver = resolve;
    });

    f(function(a) {
        resolver(a);
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

Stream.prototype.chain = function(f) {
    var env = this;
    return new Stream(function(state) {
        env.foreach(function(a) {
            f(a).fold(
                function(a) {
                    state(a);
                },
                function(){}
            );
        });
    });
};

Stream.prototype.concat = function(b) {
    return this.chain(function(a) {
        return Option.some(a.concat(b));
    });
};

Stream.prototype.empty = function() {
    return this.chain(function(a) {
        return Option.some(bilby.empty(a));
    });
};

Stream.prototype.foreach = function(f) {
    var env = this;
    return new Stream(function(state) {
        env.promise.fork(
            f,
            function(error) {}
        );
    });
};

Stream.prototype.filter = function(f) {
    return this.chain(function(a) {
        return f(a) ? Option.some(a) : Option.none;
    });
};

Stream.prototype.map = function(f) {
    return this.chain(function(a) {
        return Option.some(f(a));
    });
};

Stream.prototype.zip = function(s) {
    var env = this;

    var resolver,
        left = [],
        right = [];

    var stream = new Stream(function(state) {
        resolver = state;
    });

    this.foreach(function(a) {
        if (right.length)
            resolver([a, right.shift()]);
        else left.push(a);
    });
    s.foreach(function(a) {
        if (left.length)
            resolver([left.shift(), a]);
        else right.push(a);
    });

    return stream;
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
