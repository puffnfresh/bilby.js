// These tests ensure that bilby.js has some underscore.js
// compatibility

var _ = require('./lib/test');

exports.map = function(test) {
    test.deepEqual(_.map([1, 2, 3], function(num){ return num * 3; }), [3, 6, 9]);
    test.done();
};

exports.isArray = function(test) {
    test.equal((function(){ return _.isArray(arguments); })(), false);
    test.equal(_.isArray([1,2,3]), true);
    test.done();
};

exports.isFunction = function(test) {
    test.equal(_.isFunction(Math.pow), true);
    test.done();
};

exports.isString = function(test) {
    test.equal(_.isString("moe"), true);
    test.done();
};

exports.isNumber = function(test) {
    test.equal(_.isNumber(8.4 * 5), true);
    test.done();
};

exports.extend = function(test) {
    test.deepEqual(_.extend({name : 'moe'}, {age : 50}), {name : 'moe', age : 50});
    test.done();
};

exports.bind = function(test) {
    var func = function asdf(greeting){ return greeting + ': ' + this.name };
    func = _.bind(func, {name : 'moe'}, 'hi');
    test.equal(func(), 'hi: moe');
    test.done();
};

exports.identity = function(test) {
    var moe = {name : 'moe'};
    test.strictEqual(_.identity(moe), moe);
    test.done();
};
