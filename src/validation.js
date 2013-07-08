/**
   # Validation

       Validation e v = Failure e + Success v

   The Validation data type represents a "success" value or a
   semigroup of "failure" values. Validation has an applicative
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

var Validation = taggedSum({
    success: ['value'],
    failure: ['errors']
});

Validation.success.prototype.map = function(f) {
    return Validation.success(f(this.value));
};
Validation.success.prototype.ap = function(v) {
    return v.map(this.value);
};

Validation.failure.prototype.map = function() {
    return this;
};
Validation.failure.prototype.ap = function(b, concat) {
    var a = this;
    return b.cata({
        success: function(value) {
            return a;
        },
        failure: function(errors) {
            return Validation.failure(concat(a.errors, errors));
        }
    });
};

/**
   ## success(x)

   Constructor to represent the existance of a value, `x`.
**/
Validation.success.prototype.isSuccess = true;
Validation.success.prototype.isFailure = false;

/**
   ## failure(x)

   Constructor to represent the existance of a value, `x`.
**/
Validation.failure.prototype.isSuccess = false;
Validation.failure.prototype.isFailure = true;

/**
   ## isValidation(a)

   Returns `true` iff `a` is a `success` or a `failure`.
**/
var isValidation = isInstanceOf(Validation);

Do.setValueOf(Validation.prototype);

bilby = bilby
    .property('success', Validation.success)
    .property('failure', Validation.failure)
    .property('isValidation', isValidation)
    .method('map', isValidation, function(v, f) {
        return v.map(f);
    })
    .method('ap', isValidation, function(vf, v) {
        return vf.ap(v, this.concat);
    });
