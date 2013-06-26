var Stream = function(f) {
    // Hmm... this is very much mutable!
    // Have to work out how a stream can listen to another stream that's already been created.
    var env = this;
    env.subs = [];
    env.values = List.nil.of();
    f(function(a) {
        env.values = env.values.append(a);
        env.subs.forEach(function(s) {
            s(a);
        });
    });
};

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

Stream.prototype.subscribe = function(f) {
    this.subs.push(f);
};

Stream.prototype.foreach = function(f) {
    var m;
    this.subscribe(function(a) {
        f(a);
        m(a);
    });
    return new Stream(function(state) {
        m = state;
    });
};

Stream.prototype.map = function(f) {
    var m;
    this.subscribe(function(a) {
        m(f(a));
    });
    return new Stream(function(state) {
        m = state;
    });
};

Stream.prototype.toArray = function() {
    return this.values.toArray();
};

/**

  ## sequential

      Stream.sequential([1, 2, 3, 4]).foreach(function (a) {
        console.log(a);
      });
 */
Stream.sequential = function(values, delay) {
    var index = 0;
    return Stream.poll(function() {
        if (index >= values.length - 1) return done(values[index]);
        return cont(function() {
          return values[index++];
        });
    }, delay || 0);
};

/**

  ## poll

      Stream.poll(function() {
        return cont(function() {
            return bilby.method('arb', Number);
        })
      }).foreach(function (a) {
        console.log(a);
      });
 */
Stream.poll = function(pulse, delay) {
    return Stream.of(function(handler) {
        var id = setInterval(handler, delay);
        return function() {
            return clearInterval(id);
        };
    }, pulse);
};

bilby = bilby
  .property('Stream', Stream);
