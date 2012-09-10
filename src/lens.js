function store(setter, getter) {
    if(!(this instanceof store))
        return new store(setter, getter);

    this.setter = setter;
    this.getter = getter;

    this.map = function(f) {
        return store(compose(f, setter), getter);
    };
}
var isStore = isInstanceOf(store);

function lens(f) {
    if(!(this instanceof lens))
        return new lens(f);

    this.run = function(x) {
        return f(x);
    };

    this.compose = function(l) {
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
}
var isLens = isInstanceOf(lens);

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
    .method('<', isStore, function(a, b) {
        return a.map(b);
    })

    .property('lens', lens)
    .property('isLens', isLens)
    .property('objectLens', objectLens);
