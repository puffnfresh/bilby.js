var Stream = tagged('Stream', ['state']);

Stream.of = function(a, b) {
    var result = [];
    var unbinder = a(function() {
        var bounce = b();
        if (!bounce.isDone) {
            result.push(bounce.thunk());
        } else {
            result.push(bounce.result);
            unbinder();
        }
    });
    return new Stream(1);
};

/**

  ## sequential

      Stream.sequential([1, 2, 3, 4]).foreach(function (a) {
        console.log(a);
      });
 */
Stream.sequential = function(values) {
    var index = 0;
    return Stream.poll(function() {
        if (index >= values.length - 1) return done(values[index]);
        return cont(function() {
          return values[index++];
        });
    }, 0);
};

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
