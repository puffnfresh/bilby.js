/**
  # Id

  * concat(b) - TODO
  * empty() - TODO
  * map(f) - TODO
  * ap(b) - TODO
  * chain(f) - TODO
**/
var Id = tagged('Id', ['value']);

// Monad
Id.of = function(a) {
    return new Id(a);
};

// Semigroup (value must also be a Semigroup)
Id.prototype.concat = function(b) {
    return new Id(this.value.concat(b.value));
};

// Monoid (value must also be a Monoid)
Id.prototype.empty = function() {
    return new Id(this.value.empty ? this.value.empty() : this.value.constructor.empty());
};

// Functor
Id.prototype.map = function(f) {
    return new Id(f(this.value));
};

// Applicative
Id.prototype.ap = function(b) {
    return new Id(this.value(b.value));
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

bilby = bilby
   .property('Id', Id)
   .property('isId', isId)
   .method('concat', isId, function(a, b) {
      return a.concat(b, this.concat);
   })
   .method('empty', isId, function(a) {
      return a.empty();
   })
   .method('map', isId, function(a, b) {
      return a.map(b);
   })
   .method('ap', isId, function(a, b) {
      return a.ap(b);
   })
   .method('chain', isId, function(a, b) {
      return a.chain(b);
   });
