var λ = require('../bilby');

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

exports.bindTest = function(test) {
    test.equal(
        λ.right(1).bind(function(x) {
            return λ.right(x + 1);
        }).bind(function(x) {
            return λ.right(x + 1);
        }).fold(λ.badLeft, λ.identity),
        3
    );
    test.equal(
        λ.right(1).bind(function(x) {
            return λ.left(x + 1);
        }).bind(function(x) {
            return λ.right(x + 1);
        }).fold(λ.identity, λ.badRight),
        2
    );
    test.equal(
        λ.left(1).bind(function(x) {
            return λ.right(x + 1);
        }).bind(function(x) {
            return λ.right(x + 1);
        }).fold(λ.identity, λ.badRight),
        1
    );
    test.done();
};

exports.applyTest = function(test) {
    function f(x) {
        return x + 1;
    }
    test.equal(
        λ.right(f).apply(λ.right(1)).fold(λ.badLeft, λ.identity),
        2
    );
    test.equal(
        λ.right(f).apply(λ.left(1)).fold(λ.identity, λ.badRight),
        1
    );
    test.equal(
        λ.left(f).apply(λ.right(1)).fold(λ.identity, λ.badRight),
        f
    );
    test.done();
};

exports.appendTest = function(test) {
    test.equal(
        λ.right(1).append(λ.right(2), λ['+']).fold(λ.badLeft, λ.identity),
        3
    );
    test.equal(
        λ.right(1).append(λ.left(2), λ['+']).fold(λ.identity, λ.badRight),
        2
    );
    test.equal(
        λ.left(1).append(λ.right(2), λ['+']).fold(λ.identity, λ.badRight),
        1
    );
    test.equal(
        λ.left(1).append(λ.left(2), λ['+']).fold(λ.identity, λ.badRight),
        3
    );
    test.done();
};
