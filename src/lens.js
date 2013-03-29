/**
   # Lenses

   Lenses allow immutable updating of nested data structures.
**/

/**
   ## store(setter, getter)

   A `store` is a combined getter and setter that can be composed with
   other stores.
**/
function store(setter, getter) {
    var self = getInstance(this, store);
    self.setter = setter;
    self.getter = getter;
    self.map = function(f) {
        return store(compose(f, setter), getter);
    };
    return self;
}
/**
   ## isStore(a)

   Returns `true` iff `a` is a `store`.
**/
var isStore = isInstanceOf(store);

/**
   ## lens(f)

   A total `lens` takes a function, `f`, which itself takes a value
   and returns a `store`.

   * run(x) - gets the lens' `store` from `x`
   * compose(l) - lens composition
**/
function lens(f) {
    var self = getInstance(this, lens);
    self.run = function(x) {
        return f(x);
    };
    self.compose = function(l) {
        var t = this;
        return lens(function(x) {
            var ls = l.run(x),
                ts = t.run(ls.getter);

            return store(
                compose(ls.setter, ts.setter),
                ts.getter
            );
        });
    };
    return self;
}
/**
   ## isLens(a)

   Returns `true` iff `a` is a `lens`.
**/
var isLens = isInstanceOf(lens);

/**
   ## objectLens(k)

   Creates a total `lens` over an object for the `k` key.
**/
function objectLens(k) {
    return lens(function(o) {
        return store(function(v) {
            return extend(
                o,
                singleton(k, v)
            );
        }, o[k]);
    });
}

bilby = bilby
    .property('store', store)
    .property('isStore', isStore)
    .method('map', isStore, function(a, b) {
        return a.map(b);
    })

    .property('lens', lens)
    .property('isLens', isLens)
    .property('objectLens', objectLens);
