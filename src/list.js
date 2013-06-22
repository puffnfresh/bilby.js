/**
    # List

    * fold(a, b) - applies `a` to value if `cons` or defaults to `b`
    * map(f) - functor map
**/
var List = taggedSum({
    cons: ['car', 'cdr'],
    nil: []
});

List.prototype.fold = function(f, g) {
    var accum = List.nil;

    var p = this;
    while(p.isNonEmpty) {
        // Not sure is we should create list.cons here or in map
        accum = f(p.car, accum);
        p = p.cdr;
    }

    return accum;
};

List.prototype.map = function(f) {
    return this.fold(
        function(a, b) {
            return List.cons.of(f(a), b);
        },
        function() {
            return this;
        }
    );
};

/**
   ## cons(a, b)

   Constructor to represent the existence of a value in a list, `a`
   and a reference to another `b`.
**/
List.cons.prototype.isEmpty = false;
List.cons.prototype.isNonEmpty = true;

/**
   ## of(x)

   Constructor `of` Monad creating `List.some` with value of `a` and `b`.
**/
List.cons.of = function(a, b) {
    return List.cons(a, b);
};

/**
   ## nil

   Represents an empty list (absence of a list).
**/
List.nil.isEmpty = true;
List.nil.isNonEmpty = false;

/**
   ## of(x)

   Constructor `of` Monad creating `List.nil`.
**/
List.nil.of = function() {
    return List.nil;
};

/**
   ## isList(a)

   Returns `true` if `a` is a `cons` or `nil`.
**/
var isList = isInstanceOf(List);

bilby = bilby
    .property('cons', List.cons)
    .property('nil', List.nil)
    .property('isList', isList)
    .method('fold', isList, function(a, f, g) {
        return a.fold(f, g);
    })
    .method('map', isList, function(a, b) {
        return a.map(b);
    });
