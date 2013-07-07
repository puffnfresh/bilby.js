/**
  # Id

  * concat(b) - semigroup concat
  * map(f) - functor map
  * ap(b) - applicative ap(ply)
  * chain(f) - chain value
  * arb() - arbitrary value
**/
var Id = tagged('Id', ['value']);

// Monad
Id.of = function(a) {
    return new Id(a);
};

// Semigroup (value must also be a Semigroup)
Id.prototype.concat = function(b) {
    return Id.of(this.value.concat(b.value));
};

// Functor
Id.prototype.map = function(f) {
    return Id.of(f(this.value));
};

// Applicative
Id.prototype.ap = function(b) {
    return Id.of(this.value(b.value));
};

// Chain
Id.prototype.chain = function(f) {
    return f(this.value);
};

/**
   ## isId(a)

   Returns `true` if `a` is `Id`.
**/
var isId = isInstanceOf(Id);

/**
   ## idOf(type)

   Sentinel value for when an Id of a particular type is needed:

       idOf(Number)
**/
function idOf(type) {
    var self = getInstance(this, idOf);
    self.type = type;
    return self;
}

/**
   ## isIdOf(a)

   Returns `true` iff `a` is an instance of `idOf`.
**/
var isIdOf = isInstanceOf(idOf);

bilby = bilby
    .property('Id', Id)
    .property('idOf', idOf)
    .property('isIdOf', isIdOf)
    .method('concat', isId, function(a, b) {
        return a.concat(b, this.concat);
    })
    .method('empty', isIdOf, function(i) {
        return Id(this.empty(i.type));
    })
    .method('map', isId, function(a, b) {
        return a.map(b);
    })
    .method('ap', isId, function(a, b) {
        return a.ap(b);
    })
    .method('chain', isId, function(a, b) {
        return a.chain(b);
    })
    .method('equal', isId, function(a, b) {
        return this.equal(a.value, b.value);
    })
    .method('arb', strictEquals(Id), function() {
        var env = this;
        var t = env.fill(1)(function() {
            return AnyVal;
        });
        return Id.of.apply(this, env.map(t, function(arg) {
            return env.arb(arg, t.length);
        }));
    });
