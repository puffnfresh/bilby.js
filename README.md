% bilby.js

![](http://brianmckenna.org/files/bilby.png)

# Build status

Main
[![Build Status](https://secure.travis-ci.org/puffnfresh/bilby.js.png)](http://travis-ci.org/puffnfresh/bilby.js)

Dependency
[![Dependencies](https://david-dm.org/SimonRichardson/bilby.js.png)](https://david-dm.org/SimonRichardson/bilby.js)

# Description

bilby.js is a serious functional programming library. Serious,
meaning it applies category theory to enable highly abstract
and generalised code. Functional, meaning that it enables
referentially transparent programs.

Some features include:

* Immutable multimethods for ad-hoc polymorphism
* Functional data structures
* Automated specification testing (ScalaCheck, QuickCheck)
* Fantasy Land compatible

![](https://raw.github.com/puffnfresh/fantasy-land/master/logo.png)

# Usage

node.js:

    var bilby = require('bilby');

Browser:

    <script src="bilby-min.js"></script>

# Development

Download the code with git:

    git clone https://github.com/puffnfresh/bilby.js.git

Install the development dependencies with npm:

    npm install

Run the tests with grunt:

    npm test

Build the concatenated scripts with grunt:

    $(npm bin)/grunt

Generate the documentation with emu:

    $(npm bin)/emu < bilby.js

# Environment
    
Environments are very important in bilby. The library itself is
implemented as a single environment.
    
An environment holds methods and properties.
    
Methods are implemented as multimethods, which allow a form of
*ad-hoc polymorphism*. Duck typing is another example of ad-hoc
polymorphism but only allows a single implementation at a time, via
prototype mutation.
    
A method instance is a product of a name, a predicate and an
implementation:
    
    var env = bilby.environment()
        .method(
            // Name
            'negate',
            // Predicate
            function(n) {
                return typeof n == 'number';
            },
            // Implementation
            function(n) {
                return -n;
            }
        );
    
    env.negate(100) == -100;
    
We can now override the environment with some more implementations:
    
    var env2 = env
        .method(
            'negate',
            function(b) {
                return typeof b == 'boolean';
            },
            function(b) {
                return !b;
            }
        );
    
    env2.negate(100) == -100;
    env2.negate(true) == false;
    
The environments are immutable; references to `env` won't see an
implementation for boolean. The `env2` environment could have
overwritten the implementation for number and code relying on `env`
would still work.
    
Properties can be accessed without dispatching on arguments. They
can almost be thought of as methods with predicates that always
return true:
    
    var env = bilby.environment()
        .property('name', 'Brian');
    
    env.name == 'Brian';
    
This means that bilby's methods can be extended:
    
    function MyData(data) {
        this.data = data;
    }
    
    var _ = bilby.method(
        'equal',
        bilby.isInstanceOf(MyData),
        function(a, b) {
            return this.equal(a.data, b.data);
        }
    );
    
    _.equal(
        new MyData(1),
        new MyData(1)
    ) == true;
    
    _.equal(
        new MyData(1),
        new MyData(2)
    ) == false;

## environment(methods = {}, properties = {})
    
* method(name, predicate, f) - adds an multimethod implementation
* property(name, value) - sets a property to value
* envConcat(extraMethods, extraProperties) - adds methods + properties
* envAppend(e) - combines two environemts, biased to `e`

# Helpers
    
The helpers module is a collection of functions used often inside
of bilby.js or are generally useful for programs.

## functionName(f)
    
Returns the name of function `f`.

## functionLength(f)
    
Returns the arity of function `f`.

## bind(f)(o)
    
Makes `this` inside of `f` equal to `o`:
    
    bilby.bind(function() { return this; })(a)() == a
    
Also partially applies arguments:
    
    bilby.bind(bilby.add)(null, 10)(32) == 42

## curry(f)
    
Takes a normal function `f` and allows partial application of its
named arguments:
    
    var add = bilby.curry(function(a, b) {
            return a + b;
        }),
        add15 = add(15);
    
    add15(27) == 42;
    
Retains ability of complete application by calling the function
when enough arguments are filled:
    
    add(15, 27) == 42;

## flip(f)
    
Flips the order of arguments to `f`:
    
    var concat = bilby.curry(function(a, b) {
            return a + b;
        }),
        prepend = flip(concat);

## identity(o)
    
Identity function. Returns `o`:
    
    forall a. identity(a) == a

## constant(c)
    
Constant function. Creates a function that always returns `c`, no
matter the argument:
    
    forall a b. constant(a)(b) == a

## compose(f, g)
    
Creates a new function that applies `f` to the result of `g` of the
input argument:
    
    forall f g x. compose(f, g)(x) == f(g(x))

## create(proto)
    
Partial polyfill for Object.create - creates a new instance of the
given prototype.

## getInstance(self, constructor)
    
Always returns an instance of constructor.
    
Returns self if it is an instanceof constructor, otherwise
constructs an object with the correct prototype.

## tagged(name, fields)
    
Creates a simple constructor for a tagged object.
    
    var Tuple = tagged('Tuple', ['a', 'b']);
    var x = Tuple(1, 2);
    var y = new Tuple(3, 4);
    x instanceof Tuple && y instanceof Tuple;

## taggedSum(constructors)
    
Creates a disjoint union of constructors, with a catamorphism.
    
    var List = taggedSum({
        Cons: ['car', 'cdr'],
        Nil: []
    });
    function listLength(l) {
        return l.cata({
            Cons: function(car, cdr) {
                return 1 + listLength(cdr);
            },
            Nil: function() {
                return 0;
            }
        });
    }
    listLength(List.Cons(1, new List.Cons(2, List.Nil()))) == 2;

## error(s)
    
Turns the `throw new Error(s)` statement into an expression.

## zip(a, b)
    
Takes two lists and pairs their values together into a "tuple" (2
length list):
    
    zip([1, 2, 3], [4, 5, 6]) == [[1, 4], [2, 5], [3, 6]]

## singleton(k, v)
    
Creates a new single object using `k` as the key and `v` as the
value. Useful for creating arbitrary keyed objects without
mutation:
    
    singleton(['Hello', 'world'].join(' '), 42) == {'Hello world': 42}

## extend(a, b)
    
Right-biased key-value concat of objects `a` and `b`:
    
    bilby.extend({a: 1, b: 2}, {b: true, c: false}) == {a: 1, b: true, c: false}

## isTypeOf(s)(o)
    
Returns `true` iff `o` has `typeof s`.

## isFunction(a)
    
Returns `true` iff `a` is a `Function`.

## isBoolean(a)
    
Returns `true` iff `a` is a `Boolean`.

## isNumber(a)
    
Returns `true` iff `a` is a `Number`.

## isString(a)
    
Returns `true` iff `a` is a `String`.

## isArray(a)
    
Returns `true` iff `a` is an `Array`.

## isEven(a)
    
Returns `true` iff `a` is even.

## isOdd(a)
    
Returns `true` iff `a` is odd.

## isInstanceOf(c)(o)
    
Returns `true` iff `o` is an instance of `c`.

## AnyVal
    
Sentinal value for when any type of primitive value is needed.

## Char
    
Sentinal value for when a single character string is needed.

## arrayOf(type)
    
Sentinel value for when an array of a particular type is needed:
    
    arrayOf(Number)

## isArrayOf(a)
    
Returns `true` iff `a` is an instance of `arrayOf`.

## objectLike(props)
    
Sentinal value for when an object with specified properties is
needed:
    
    objectLike({
        age: Number,
        name: String
    })

## isObjectLike(a)
    
Returns `true` iff `a` is an instance of `objectLike`.

## or(a)(b)
    
Curried function for `||`.

## and(a)(b)
    
Curried function for `&&`.

## add(a)(b)
    
Curried function for `+`.

## strictEquals(a)(b)
    
Curried function for `===`.

## not(a)
    
Returns `true` iff `a` is falsy.

## fill(s)(t)
    
Curried function for filling array.

## range(a, b)
    
Create an array with a given range (length).

## liftA2(f, a, b)
    
Lifts a curried, binary function `f` into the applicative passes
`a` and `b` as parameters.

## sequence(m, a)
    
Sequences an array, `a`, of values belonging to the `m` monad:
    
     bilby.sequence(Array, [
         [1, 2],
         [3],
         [4, 5]
     ]) == [
         [1, 3, 4],
         [1, 3, 5],
         [2, 3, 4],
         [2, 3, 5]
     ]

# Do (operator overloading)
    
Adds operator overloading for functional syntax:
    
  * `>=` - monad flatMap/bind:
    
        bilby.Do()(
            bilby.some(1) >= function(x) {
                return x < 0 ? bilby.none : bilby.some(x + 2);
            }
        ).getOrElse(0) == 3;
    
  * `>>` - kleisli:
    
        bilby.Do()(
            function(x) {
                return x < 0 ? bilby.none : bilby.some(x + 1);
            } >> function(x) {
                return x % 2 != 0 ? bilby.none : bilby.some(x + 1);
            }
        )(1).getOrElse(0) == 3;
    
  * `<` - functor map:
    
        bilby.Do()(
            bilby.some(1) < add(2)
        ).getOrElse(0) == 3;
    
  * `*` - applicative ap(ply):
    
        bilby.Do()(
            bilby.some(add) * bilby.some(1) * bilby.some(2)
        ).getOrElse(0) == 3;
    
  * `+` - semigroup concat:
    
        bilby.Do()(
            bilby.some(1) + bilby.some(2)
        ).getOrElse(0) == 3;

## Do()(a)
    
Creates a new syntax scope. The `a` expression is allowed multiple
usages of a single operator per `Do` call:
    
* `>=` - flatMap
* `>>` - kleisli
* `<` - map
* `*` - ap
* `+` - concat
    
The associated name will be called on the bilby environment with
the operands. For example:
    
    bilby.Do()(bilby.some(1) + bilby.some(2))
    
Desugars into:
    
    bilby.concat(bilby.some(1), bilby.some(2))

## Do.setValueOf(proto)
    
Used to mutate the `valueOf` property on `proto`. Necessary to do
the `Do` block's operator overloading. Uses the object's existing
`valueOf` if not in a `Do` block.
    
*Warning:* this mutates `proto`. May not be safe, even though it
tries to default back to the normal behaviour when not in a `Do`
block.

# Trampoline
    
Reifies continutations onto the heap, rather than the stack. Allows
efficient tail calls.
    
Example usage:
    
    function loop(n) {
        function inner(i) {
            if(i == n) return bilby.done(n);
            return bilby.cont(function() {
                return inner(i + 1);
            });
        }
    
        return bilby.trampoline(inner(0));
    }
    
Where `loop` is the identity function for positive numbers. Without
trampolining, this function would take `n` stack frames.

## done(result)
    
Result constructor for a continuation.

## cont(thunk)
    
Continuation constructor. `thunk` is a nullary closure, resulting
in a `done` or a `cont`.

## trampoline(bounce)
    
The beginning of the continuation to call. Will repeatedly evaluate
`cont` thunks until it gets to a `done` value.

# Id
    
* concat(b) - semigroup concat
* map(f) - functor map
* ap(b) - applicative ap(ply)
* chain(f) - chain value
* arb() - arbitrary value

## isId(a)
    
Returns `true` if `a` is `Id`.

## idOf(type)
    
Sentinel value for when an Id of a particular type is needed:
    
    idOf(Number)

## isIdOf(a)
    
Returns `true` iff `a` is an instance of `idOf`.

# Identity
    
The Identity monad is a monad that does not embody any computational
strategy. It simply applies the bound function to its input without
any modification.
    
* chain(f) - chain values
* map(f) - functor map
* ap(a) - applicative ap(ply)

## isIdentity(a)
    
Returns `true` if `a` is `Identity`.

## Identity Transformer
    
The trivial monad transformer, which maps a monad to an equivalent monad.
    
* chain(f) - chain values
* map(f) - functor map
* ap(a) - applicative ap(ply)

# Option
    
    Option a = Some a + None
    
The option type encodes the presence and absence of a value. The
`some` constructor represents a value and `none` represents the
absence.
    
* fold(a, b) - applies `a` to value if `some` or defaults to `b`
* getOrElse(a) - default value for `none`
* isSome - `true` iff `this` is `some`
* isNone - `true` iff `this` is `none`
* toLeft(r) - `left(x)` if `some(x)`, `right(r)` if none
* toRight(l) - `right(x)` if `some(x)`, `left(l)` if none
* flatMap(f) - monadic flatMap/bind
* map(f) - functor map
* ap(s) - applicative ap(ply)
* concat(s, plus) - semigroup concat

## of(x)
    
Constructor `of` Monad creating `Option` with value of `x`.

## some(x)
    
Constructor to represent the existence of a value, `x`.

## none
    
Represents the absence of a value.

## isOption(a)
    
Returns `true` if `a` is a `some` or `none`.

# Either
    
    Either a b = Left a + Right b
    
Represents a tagged disjunction between two sets of values; `a` or
`b`. Methods are right-biased.
    
* fold(a, b) - `a` applied to value if `left`, `b` if `right`
* swap() - turns `left` into `right` and vice-versa
* isLeft - `true` iff `this` is `left`
* isRight - `true` iff `this` is `right`
* toOption() - `none` if `left`, `some` value of `right`
* toArray() - `[]` if `left`, singleton value if `right`
* flatMap(f) - monadic flatMap/bind
* map(f) - functor map
* ap(s) - applicative ap(ply)
* concat(s, plus) - semigroup concat

## left(x)
    
Constructor to represent the left case.

## right(x)
    
Constructor to represent the (biased) right case.

## isEither(a)
    
Returns `true` iff `a` is a `left` or a `right`.

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

## success(x)
    
Constructor to represent the existance of a value, `x`.

## failure(x)
    
Constructor to represent the existance of a value, `x`.

## isAttempt(a)
    
Returns `true` iff `a` is a `success` or a `failure`.

# Lenses
    
Lenses allow immutable updating of nested data structures.

## store(setter, getter)
    
A `store` is a combined getter and setter that can be composed with
other stores.

## isStore(a)
    
Returns `true` iff `a` is a `store`.

## lens(f)
    
A total `lens` takes a function, `f`, which itself takes a value
and returns a `store`.
    
* run(x) - gets the lens' `store` from `x`
* compose(l) - lens composition

## isLens(a)
    
Returns `true` iff `a` is a `lens`.

## objectLens(k)
    
Creates a total `lens` over an object for the `k` key.

# Input/output
    
Purely functional IO wrapper.

## io(f)
    
Pure wrapper around a side-effecting `f` function.
    
* perform() - action to be called a single time per program
* flatMap(f) - monadic flatMap/bind

## isIO(a)
    
Returns `true` iff `a` is an `io`.

# Tuples
    
Tuples are another way of storing multiple values in a single value.
They have a fixed number of elements (immutable), and so you can't
cons to a tuple.
Elements of a tuple do not need to be all of the same type
    
Example usage:
    
     bilby.Tuple2(1, 2);
     bilby.Tuple3(1, 2, 3);
     bilby.Tuple4(1, 2, 3, 4);
     bilby.Tuple5(1, 2, 3, 4, 5);
    
* arb() - arbitrary value
* fold(f) - `f` applied to value
* map() - functor map

## Tuple2
    
* flip() - flip values
* concat() - Semigroup (value must also be a Semigroup)

## Tuple3
    
* concat() - Semigroup (value must also be a Semigroup)

## Tuple4
    
* concat() - Semigroup (value must also be a Semigroup)

## Tuple5
    
* concat() - Semigroup (value must also be a Semigroup)

## isTuple(a)
    
Returns `true` if `a` is `Tuple`.

## isTuple2(a)
    
Returns `true` if `a` is `Tuple2`.

## isTuple4(a)
    
Returns `true` if `a` is `Tuple3`.

## isTuple4(a)
    
Returns `true` if `a` is `Tuple4`.

## isTuple5(a)
    
Returns `true` if `a` is `Tuple5`.

# Promise(fork)
    
Promise is a constructor which takes a `fork` function. The `fork`
function takes one argument:
    
    fork(resolve)
    
Where `resolve` is a side-effecting callback.
    
## fork(resolve)
    
The `resolve` callback gets called when a value is resolved.

## of(x)
    
Creates a Promise that contains a successful value.

## chain(f)
    
Returns a new promise that evaluates `f` when the current promise
is successfully fulfilled. `f` must return a new promise.

## map(f)
    
Returns a new promise that evaluates `f` on a value and passes it
through to the resolve function.

## isPromise(a)
    
Returns `true` if `a` is `Promise`.

# State(run)
    
* chain() - TODO
* evalState() - evaluate state
* execState() - execute on state
* map() - functor map
* ap() - applicative ap(ply)

## isState(a)
    
Returns `true` if `a` is `State`.

# List
    
    List a = Cons a + Nil
    
The list type data type constructs objects which points to values. The `cons`
constructor represents a value, the left is the head (`car`, the first element)
and the right represents the tail (`cdr`, the second element). The `nil`
constructor is defined as an empty list.
    
The following example creates a list of values 1 and 2, where the nil terminates
the list:
    
    cons(1, cons(2, nil));
    
The following can also represent tree like structures (Binary Trees):
    
    cons(cons(1, cons(2, nil)), cons(3, cons(4, nil)));
    
         *
        / \
       *   *
      / \ / \
     1  2 3  4
    
* concat(a) - semigroup concat
* fold(a, b) - applies `a` to value if `cons` or defaults to `b`
* map(f) - functor map
* fold(f) - applies f to values
* flatMap(f) - monadic flatMap
* append(a) - append
* appendAll(a) - append values
* prepend(a) - prepend value
* prependAll(a) - prepend values
* reverse() - reverse
* exists() - test by predicate
* filter() - filter by predicate
* partition() - partition by predicate
* size() - size of the list

## cons(a, b)
    
Constructor to represent the existence of a value in a list, `a`
and a reference to another `b`.

## nil
    
Represents an empty list (absence of a list).

## isList(a)
    
Returns `true` if `a` is a `cons` or `nil`.

# Stream(state)
    
The Stream type represents a flow of data ever evolving values over time.
    
Here is an example of a continuous random numbers piped through to the console.
    
    Stream.poll(
        function() {
            return cont(function() {
                return bilby.method('arb', Number);
            })
        },
    0).forEach(
        function (a) {
            console.log(a);
        }
    );
    
* concat(b) - semigroup concat
* chain(f) - chain streams
* forEach(f) - iteration of async values
* filter(f) - filter values
* map(f) - functor map
* reduce(v, f) - functor reduce
* merge(s) - merge streams
* zip(s) - zip streams

    
## promise
    
    Stream.promise(promise).forEach(function (a) {
      console.log(a);
    });

    
## sequential
    
    Stream.sequential([1, 2, 3, 4]).forEach(function (a) {
      console.log(a);
    });

    
## poll
    
    Stream.poll(function() {
      return cont(function() {
          return bilby.method('arb', Number);
      })
    }, 0).forEach(function (a) {
      console.log(a);
    });

## isStream(a)
    
Returns `true` if `a` is `Stream`.

# QuickCheck
    
QuickCheck is a form of *automated specification testing*. Instead
of manually writing tests cases like so:
    
    assert(0 + 1 == 1);
    assert(1 + 1 == 2);
    assert(3 + 3 == 6);
    
We can just write the assertion algebraicly and tell QuickCheck to
automaticaly generate lots of inputs:
    
    bilby.forAll(
        function(n) {
            return n + n == 2 * n;
        },
        [Number]
    ).fold(
        function(fail) {
            return "Failed after " + fail.tries + " tries: " + fail.inputs.toString();
        },
        "All tests passed!"
    )

### failureReporter
    
* inputs - the arguments to the property that failed
* tries - number of times inputs were tested before failure

## forAll(property, args)
    
Generates values for each type in `args` using `bilby.arb` and
then passes them to `property`, a function returning a
`Boolean`. Tries `goal` number of times or until failure.
    
Returns an `Option` of a `failureReporter`:
    
    var reporter = bilby.forAll(
        function(s) {
            return isPalindrome(s + s.split('').reverse().join(''));
        },
        [String]
    );

## goal
    
The number of successful inputs necessary to declare the whole
property a success:
    
    var _ = bilby.property('goal', 1000);
    
Default is `100`.