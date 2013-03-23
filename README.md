% bilby.js

# Description

bilby.js is a serious functional programming library. Serious,
meaning it applies category theory to enable highly abstract
and generalised code. Functional, meaning that it enables
referentially transparent programs.

Some features include:

* Immutable multimethods for ad-hoc polymorphism
* Functional data structures
* Operator overloading for functional syntax
* Automated specification testing (ScalaCheck, QuickCheck)

# Usage

node.js:

    var bilby = require('bilby');

Browser:

    <script src="bilby-min.js"></script>

# Development

Download the code with git:

    git clone https://github.com/pufuwozu/bilby.js.git

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
* concat(extraMethods, extraProperties) - adds methods + properties
* append(e) - combines two environemts, biased to `e`

# Helpers
    
The helpers module is a collection of functions used often inside
of bilby.js or are generally useful for programs.

## functionLength(f)
    
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
    
    var append = bilby.curry(function(a, b) {
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
        return l.cata(
            function(car, cdr) {
                return 1 + listLength(cdr);
            },
            function() {
                return 0;
            }
        );
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
    
Right-biased key-value append of objects `a` and `b`:
    
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

## isInstanceOf(c)(o)
    
Returns `true` iff `o` is an instance of `c`.

## AnyVal
    
Sentinal value for when any type of primitive value is needed.

## Char
    
Sentinal value for when a single character string is needed.

## arrayOf(type)
    
Sentinal value for when an array of a particular type is needed:
    
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

# Do (operator overloading)
    
Adds operator overloading for functional syntax:
    
  * `>=` - monads:
    
        bilby.Do()(
            bilby.some(1) >= function(x) {
                return x < 0 ? bilby.none : bilby.some(x + 2);
            }
        ).getOrElse(0) == 3;
    
  * `>>` - kleislis:
    
        bilby.Do()(
            function(x) {
                return x < 0 ? bilby.none : bilby.some(x + 1);
            } >> function(x) {
                return x % 2 != 0 ? bilby.none : bilby.some(x + 1);
            }
        )(1).getOrElse(0) == 3;
    
  * `<` - functors:
    
        bilby.Do()(
            bilby.some(1) < add(2)
        ).getOrElse(0) == 3;
    
  * `*` - applicatives:
    
        bilby.Do()(
            bilby.some(add) * bilby.some(1) * bilby.some(2)
        ).getOrElse(0) == 3;
    
  * `+` - semigroups:
    
        bilby.Do()(
            bilby.some(1) + bilby.some(2)
        ).getOrElse(0) == 3;

## Do()(a)
    
Creates a new syntax scope. The `a` expression is allowed multiple
usages of a single operator per `Do` call:
    
* `>=`
* `>>`
* `<`
* `*`
* `+`
    
The string name of the operator will be called on the bilby
environment with the operands, for example:
    
    bilby.Do()(bilby.some(1) + bilby.some(2))
    
Will desugar into:
    
    bilby['+'](bilby.some(1), bilby.some(2))

## Do.setValueOf(proto)
    
Used to mutate the `valueOf` property on `proto`. Necessary to do
the `Do` block's operator overloading. Uses the object's existing
`valueOf` if not in a `Do` block.
    
*Warning:* this mutates `proto`. May not be safe, even though it
tries to default back to the normal behaviour when not in a `Do`
block.

# Data structures
    
Church-encoded versions of common functional data
structures. Disjunction is enoded by multiple constructors with
different implementations of common functions.

## Option
    
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
* bind(f) - monadic bind
* map(f) - functor map
* apply(s) - applicative apply
* append(s, plus) - semigroup append

### some(x)
    
Constructor to represent the existance of a value, `x`.

### none
    
Represents the absence of a value.

## isOption(a)
    
Returns `true` iff `a` is a `some` or `none`.

## Either
    
    Either a b = Left a + Right b
    
Represents a tagged disjunction between two sets of values; `a` or
`b`. Methods are right-biased.
    
* fold(a, b) - `a` applied to value if `left`, `b` if `right`
* swap() - turns `left` into `right` and vice-versa
* isLeft - `true` iff `this` is `left`
* isRight - `true` iff `this` is `right`
* toOption() - `none` if `left`, `some` value of `right`
* toArray() - `[]` if `left`, singleton value if `right`
* bind(f) - monadic bind
* map(f) - functor map
* apply(s) - applicative apply
* append(s, plus) - semigroup append

### left(x)
    
Constructor to represent the left case.

### right(x)
    
Constructor to represent the (biased) right case.

## isEither(a)
    
Returns `true` iff `a` is a `left` or a `right`.

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
* bind(f) - monadic bind

## isIO(a)
    
Returns `true` iff `a` is an `io`.

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
        "All tests passed!",
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
