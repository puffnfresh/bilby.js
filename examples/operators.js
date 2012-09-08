require('../bilby').bilbify(global);

var monad = Do()(
    some(1) >= function(x) {
        return x < 0 ? none : some(x + 2);
    }
);
console.log(monad.getOrElse(0));

var kleisli = Do()(
    function(x) {
        return x < 0 ? none : some(x + 1);
    } >> function(x) {
        return x % 2 != 0 ? none : some(x + 1);
    }
);
console.log(kleisli(1).getOrElse(0));

var functor = Do()(
    some(1) > function(x) {
        return x + 2;
    }
);
console.log(functor.getOrElse(0));

var applicative = Do()(
    some(function(x) {
        return function(y) {
            return x + y;
        };
    }) * some(1) * some(2)
);
console.log(applicative.getOrElse(0));

var semigroup = Do()(
    some(1) + some(2)
);
console.log(semigroup.getOrElse(0));
