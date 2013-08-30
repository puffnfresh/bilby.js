/**
  ## Stream(fork)

  The Stream type represents a flow of data ever evolving values over time.

  Here is an example of a number piped through to the console.

        Stream.of(1).map(
            function (a) {
                return a + 1;
            }
        ).fork(console.log);


   * `ap(a, b)` - Applicative ap(ply)
   * `concat(a, b)` - Appends two stream objects.
   * `drop(a, n)` - Returns the stream without its n first elements. If this stream has less than n elements, the empty stream is returned.
   * `filter(a, f)` - Returns all the elements of this stream that satisfy the predicate p.
   * `chain(a, f)` - Applies the given function f to each element of this stream, then concatenates the results.
   * `fold(a, v, f)` - Combines the elements of this stream together using the binary function f, from Left to Right, and starting with the value v.
   * `map(a, f)` - Returns the stream resulting from applying the given function f to each element of this stream.
   * `scan(a, f)` - Combines the elements of this stream together using the binary operator op, from Left to Right
   * `take(n)` - Returns the n first elements of this stream.
   * `zip(a, b)` - Returns a stream formed from this stream and the specified stream that by associating each element of the former with the element at the same position in the latter.
   * `zipWithIndex(a)` -  Returns a stream form from this stream and a index of the value that is associated with each element index position.
**/
var Stream = tagged('Stream', ['fork']);

/**
  ### of(x)

  Creates a stream that contains a successful value.
**/
Stream.of = function(a) {
    return Stream(
        function(next, done) {
            if (a) {
                next(a);
            }
            return done();
        }
    );
};

/**
  ### empty()

  Creates a Empty stream that contains no value.
**/
Stream.empty = function() {
    return Stream.of();
};

/**
  ### ap(b)

  Apply a function in the environment of the success of this stream
  Applicative ap(ply)
**/
Stream.prototype.ap = function(a) {
    return this.chain(
        function(f) {
            return a.map(f);
        }
    );
};

/**
  ### chain(f)

  Returns a new stream that evaluates `f` when the current stream
  is successfully fulfilled. `f` must return a new stream.
**/
Stream.prototype.chain = function(f) {
    var env = this;
    return Stream(function(next, done) {
        return env.fork(
            function(a) {
                return f(a).fork(next, function() {
                     //do nothing.
                });
            },
            done
        );
    });
};

/**
  ### concat(s, f)

  Concatenate two streams associatively together.
  Semigroup concat
**/
Stream.prototype.concat = function(a) {
    var env = this;
    return Stream(function(next, done) {
        return env.fork(
            next,
            function() {
                return a.fork(next, done);
            }
        );
    });
};

/**
  ### drop(f)

  Returns the stream without its n first elements.
**/
Stream.prototype.drop = function(n) {
    var dropped = 0;
    return this.chain(
        function(a) {
            if (dropped < n) {
                dropped++;
                return Stream.empty();
            } else {
                return Stream.of(a);
            }
        }
    );
};

/**
  ### equal(a)

  Compare two stream values for equality
**/
Stream.prototype.equal = function(a) {
    return this.zip(a).fold(
        true,
        function(v, t) {
            return v && bilby.equal(t._1, t._2);
        }
    );
};

/**
  ### extract(a)

  Extract the value from the stream.
**/
Stream.prototype.extract = function() {
    return this.fork(
        identity,
        constant(null)
    );
};

/**
  ### filter(f)

  Returns all the elements of this stream that satisfy the predicate p.
**/
Stream.prototype.filter = function(f) {
    var env = this;
    return Stream(function(next, done) {
        return env.fork(
            function(a) {
                if (f(a)) {
                    next(a);
                }
            },
            done
        );
    });
};

/**
  ### fold(v, f)

  Combines the elements of this stream together using the binary function f
**/
Stream.prototype.fold = function(v, f) {
    var env = this;
    return Stream(
        function(next, done) {
            return env.fork(
                function(a) {
                    v = f(v, a);
                    return v;
                },
                function() {
                    next(v);
                    return done();
                }
            );
        }
    );
};

/**
  ### length()

  Returns the length of the stream
**/
Stream.prototype.length = function() {
    return this.map(
        constant(1)
    ).fold(
        0,
        curry(function(x, y) {
            return x + y;
        })
    );
};

/**
  ### map(f)

  Returns the stream resulting from applying the given function f to each
  element of this stream.
**/
Stream.prototype.map = function(f) {
    return this.chain(
        function(a) {
            return Stream.of(f(a));
        }
    );
};

/**
  ### merge(a)

  Merge the values of two streams in to one stream
**/
Stream.prototype.merge = function(a) {
    var resolver;

    this.map(function(a) {
        if (resolver) resolver(a);
    });
    a.map(function(a) {
        if (resolver) resolver(a);
    });

    return Stream(
        function(next, done) {
            resolver = next;
        }
    );
};

/**
  ### pipe(a)

  Pipe a stream to a state or writer monad.
**/
Stream.prototype.pipe = function(o) {
    var env = this;
    return Stream(
        function(next, done) {
            return env.fork(
                function(v) {
                    return o.run(v);
                },
                done
            );
        }
    );
};

/**
  ### scan(a)

  Combines the elements of this stream together using the binary operator
  op, from Left to Right
**/
Stream.prototype.scan = function(a, f) {
    var env = this;
    return Stream(
        function(next, done) {
            return env.fork(
                function(b) {
                    a = f(a, b);
                    return next(a);
                },
                done
            );
        });
};

/**
  ### take(v, f)

  Returns the n first elements of this stream.
**/
Stream.prototype.take = function(n) {
    var taken = 0;
    return this.chain(
        function(a) {
            return (++taken < n) ? Stream.of(a) : Stream.empty();
        }
    );
};

/**
  ### zip(b)

  Returns a stream formed from this stream and the specified stream that
  by associating each element of the former with the element at the same
  position in the latter.

**/
Stream.prototype.zip = function(a) {
    var env = this;

    return Stream(
        function(next, done) {
            var left = [],
                right = [],
                // Horrible state
                called = false,
                end = function() {
                    if (!called) {
                        done();
                        called = true;
                    }
                };

            env.fork(
                function(a) {
                    if (right.length > 0) {
                        next(Tuple2(a, right.shift()));
                    } else {
                        left.push(a);
                    }
                },
                end
            );

            a.fork(
                function(a) {
                    if (left.length > 0) {
                        next(Tuple2(left.shift(), a));
                    } else {
                        right.push(a);
                    }
                },
                end
            );
        }
    );
};

/**
  ### zipWithIndex()

  Returns a stream form from this stream and a index of the value that
  is associated with each element index position.
**/
Stream.prototype.zipWithIndex = function() {
    var index = 0;
    return this.map(
        function(a) {
            return Tuple2(a, index++);
        }
    );
};

/**
  ## fromArray(a)

  Returns a new stream which iterates over each element of the array.
**/
Stream.fromArray = function(a) {
    return Stream(
        function(next, done) {
            bilby.map(a, next);
            return done();
        }
    );
};

/**
  ## isStream(a)

  Returns `true` if `a` is `Stream`.
**/
var isStream = isInstanceOf(Stream);

/**
  ## streamOf(type)

  Sentinel value for when an stream of a particular type is needed:

       streamOf(Number)
**/
function streamOf(type) {
    var self = getInstance(this, streamOf);
    self.type = type;
    return self;
}

/**
  ## isStreamOf(a)

  Returns `true` if `a` is `streamOf`.
**/
var isStreamOf = isInstanceOf(streamOf);

bilby = bilby
    .property('Stream', Stream)
    .property('streamOf', streamOf)
    .property('isStream', isStream)
    .property('isStreamOf', isStreamOf)
    .method('arb', isStreamOf, function(a, b) {
        var args = this.arb(a.type, b - 1);
        return Stream.fromArray(args);
    })
    .method('shrink', isStream, function(a, b) {
        return [];
    })
    .method('ap', isStream, function(a, b) {
        return a.ap(b);
    })
    .method('chain', isStream, function(a, b) {
        return a.chain(b);
    })
    .method('concat', isStream, function(a, b) {
        return a.chain(b);
    })
    .method('equal', isStream, function(a, b) {
        return a.equal(b);
    })
    .method('extract', isStream, function(a) {
        return a.extract();
    })
    .method('fold', isStream, function(a, b) {
        return a.chain(b);
    })
    .method('map', isStream, function(a, b) {
        return a.map(b);
    })
    .method('zip', isStream, function(b) {
        return a.zip(b);
    });
