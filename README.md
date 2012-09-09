# bilby.js

Serious functional programming library for JavaScript.

## Features

### Helpers

Curried and uncurried application:

    var add = λ.curry(function(a, b) {
        return a + b;
    });
    add(1)(2) == 3;
    add(1, 2) == 3;

### Functional data structures

Option:

    λ.some(3).getOrElse(0) == 3;
    λ.none.getOrElse(0) == 0;

### Operator Syntax

Monads:

    λ.Do()(
        λ.some(1) >= function(x) {
            return x < 0 ? λ.none : λ.some(x + 2);
        }
    ).getOrElse(0) == 3;

Kleislis:

    λ.Do()(
        function(x) {
            return x < 0 ? λ.none : λ.some(x + 1);
        } >> function(x) {
            return x % 2 != 0 ? λ.none : λ.some(x + 1);
        }
    )(1).getOrElse(0) == 3;

Functors:

    λ.Do()(
        λ.some(1) > add(2)
    ).getOrElse(0) == 3;

Applicatives:

    λ.Do()(
        λ.some(add) * λ.some(1) * λ.some(2)
    ).getOrElse(0) == 3;

Semigroups:

    λ.Do()(
        λ.some(1) + λ.some(2)
    ).getOrElse(0) == 3;

## Usage

node.js:

    var λ = require('bilby');

Browser:

    <script src="bilby-min.js"></script>

## TODO

* Functional data structures
