/**
   # Attempt

       Attempt e v = Failure e + Success v

   The Attempt data type represents a "success" value or a
   semigroup of "failure" values. Attempt has an applicative
   functor which collects failures' errors or creates a new success
   value.

   Here's an example function which validates a String:

       function nonEmpty(field, string) {
           return string
               ? λ.success(string)
               : λ.failure([field + " must be non-empty"]);
       }

   We might want to give back a full-name from a first-name and
   last-name if both given were non-empty:

       function getWholeName(firstName) {
           return function(lastName) {
               return firstName + " " + lastName;
           }
       }
       λ.ap(
           λ.map(nonEmpty("First-name", firstName), getWholeName),
           nonEmpty("Last-name", lastName)
       );

   When given a non-empty `firstName` ("Brian") and `lastName`
   ("McKenna"):

       λ.success("Brian McKenna");

   If given only an invalid `firstname`:

       λ.failure(['First-name must be non-empty']);

   If both values are invalid:

       λ.failure([
           'First-name must be non-empty',
           'Last-name must be non-empty'
       ]);

   * map(f) - functor map
   * ap(b, concat) - applicative ap(ply)

   ## success(value)

   Represents a successful `value`.

   ## failure(errors)

   Represents a failure.

   `errors` **must** be a semigroup (i.e. have an `concat`
   implementation in the environment).
**/

var Attempt = taggedSum({
    success: ['value'],
    failure: ['errors']
});

Attempt.success.prototype.map = function(f) {
    return Attempt.success(f(this.value));
};
Attempt.success.prototype.ap = function(v) {
    return v.map(this.value);
};

Attempt.failure.prototype.map = function() {
    return this;
};
Attempt.failure.prototype.ap = function(b, concat) {
    var a = this;
    return b.cata({
        success: function(value) {
            return a;
        },
        failure: function(errors) {
            return Attempt.failure(concat(a.errors, errors));
        }
    });
};

/**
   ## success(x)

   Constructor to represent the existance of a value, `x`.
**/
Attempt.success.prototype.isSuccess = true;
Attempt.success.prototype.isFailure = false;

/**
   ## failure(x)

   Constructor to represent the existance of a value, `x`.
**/
Attempt.failure.prototype.isSuccess = false;
Attempt.failure.prototype.isFailure = true;

/**
   ## isAttempt(a)

   Returns `true` iff `a` is a `success` or a `failure`.
**/
var isAttempt = isInstanceOf(Attempt);

bilby = bilby
    .property('success', Attempt.success)
    .property('failure', Attempt.failure)
    .property('isAttempt', isAttempt)
    .method('map', isAttempt, function(v, f) {
        return v.map(f);
    })
    .method('ap', isAttempt, function(vf, v) {
        return vf.ap(v, this.concat);
    });
