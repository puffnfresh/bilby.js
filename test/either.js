var λ = require('./lib/test');

exports.isTest = function(test) {
    test.ok(λ.left(0).isLeft);
    test.ok(λ.right(0).isRight);
    test.done();
};

exports.foldTest = function(test) {
    test.equal(λ.left(3).fold(λ.identity, λ.badRight), 3);
    test.equal(λ.right(3).fold(λ.badLeft, λ.identity), 3);
    test.done();
};

exports.swapTest = function(test) {
    test.ok(λ.left(0).swap().isRight);
    test.ok(λ.right(0).swap().isLeft);
    test.done();
};

exports.toOptionTest = function(test) {
    test.equal(λ.left(3).toOption().getOrElse(0), 0);
    test.equal(λ.right(3).toOption().getOrElse(3), 3);
    test.done();
};

exports.toArrayTest = function(test) {
    test.equal(λ.left(3).toArray().length, 0);
    test.equal(λ.right(3).toArray().length, 1);
    test.done();
};

exports.mapTest = function(test) {
    test.equal(
        λ.right(1).map(function(x) {
            return x + 2;
        }).fold(λ.badLeft, λ.identity),
        3
    );
    test.equal(
        λ.left(0).map(function(x) {
            return x + 2;
        }).fold(λ.identity, λ.badRight),
        0
    );
    test.done();
};

exports.flatMapTest = function(test) {
    test.equal(
        λ.right(1).flatMap(function(x) {
            return λ.right(x + 1);
        }).flatMap(function(x) {
            return λ.right(x + 1);
        }).fold(λ.badLeft, λ.identity),
        3
    );
    test.equal(
        λ.right(1).flatMap(function(x) {
            return λ.left(x + 1);
        }).flatMap(function(x) {
            return λ.right(x + 1);
        }).fold(λ.identity, λ.badRight),
        2
    );
    test.equal(
        λ.left(1).flatMap(function(x) {
            return λ.right(x + 1);
        }).flatMap(function(x) {
            return λ.right(x + 1);
        }).fold(λ.identity, λ.badRight),
        1
    );
    test.done();
};

exports.apTest = function(test) {
    function f(x) {
        return x + 1;
    }
    test.equal(
        λ.right(f).ap(λ.right(1)).fold(λ.badLeft, λ.identity),
        2
    );
    test.equal(
        λ.right(f).ap(λ.left(1)).fold(λ.identity, λ.badRight),
        1
    );
    test.equal(
        λ.left(f).ap(λ.right(1)).fold(λ.identity, λ.badRight),
        f
    );
    test.done();
};

exports.concatTest = function(test) {
    test.equal(
        λ.right(1).concat(λ.right(2), λ.concat).fold(λ.badLeft, λ.identity),
        3
    );
    test.equal(
        λ.right(1).concat(λ.left(2), λ.concat).fold(λ.identity, λ.badRight),
        2
    );
    test.equal(
        λ.left(1).concat(λ.right(2), λ.concat).fold(λ.badLeft, λ.identity),
        2
    );
    test.equal(
        λ.left(1).concat(λ.left(2), λ.concat).fold(λ.identity, λ.badRight),
        1
    );
    test.done();
};
