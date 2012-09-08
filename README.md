# bilby.js

Serious functional programming library for JavaScript.

## Features

### Helpers

Curried and uncurried application:

    var add = curry(function(a, b) {
        return a + b;
    });
    add(1)(2) == 3;
    add(1, 2) == 3;

### Functional data structures

Option:

    some(3).getOrElse(0) == 3;
    none.getOrElse(0) == 0;

### Operator Syntax

Monads:

    Do()(some(1) >= function(x) {
        return x < 0 ? none : some(x + 2);
    }).getOrElse(0) == 3;

Kleislis:

    Do()(function(x) {
        return x < 0 ? none : some(x + 1);
    } >> function(x) {
        return x % 2 != 0 ? none : some(x + 1);
    })(1).getOrElse(0) == 3;

Functors:

    Do()(some(1) > add(2)).getOrElse(0) == 3;

Applicatives:

    Do()(some(add) * some(1) * some(2)).getOrElse(0) == 3;

Semigroups:

    Do()(some(1) + some(2)).getOrElse(0) == 3;

## Usage

Usage is going to change dramatically, once a safe form of ad-hoc
polymorphism is implemented. For now there's an import and a separate
function call to modify native prototypes (depending on what you want
to do).

node.js:

    var λ = require('bilby');

    // If you want to have all syntax imported
    λ.patcher.all();

    // If you just want to enable syntax for arrays
    λ.patcher.arrays();

    // If you just want to enable syntax for functions
    λ.patcher.functions();

node.js import all:

    // If you want to import everything to global scope
    require('bilby').bilbify(global);

    // Can now use curry, some, none, Do, etc.

Browser:

    <script src="bilby-min.js"></script>
    <script>
      bilby.bilbify(this);
      // Can now use curry, some, none, Do, etc.
    </script>

## TODO

* Functional data structures
* Multimethods for ad-hoc polymorphism and less monkey-patching
