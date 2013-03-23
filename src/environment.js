/**
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
**/

function findRegistered(registrations, args) {
    var i;

    for(i = 0; i < registrations.length; i++) {
        if(registrations[i].predicate.apply(this, args))
            return registrations[i].f;
    }

    throw new Error("Method not implemented for this input");
}

function makeMethod(registrations) {
    return function() {
        var args = [].slice.call(arguments);
        return findRegistered(registrations, args).apply(this, args);
    };
}

/**
   ## environment(methods = {}, properties = {})

   * method(name, predicate, f) - adds an multimethod implementation
   * property(name, value) - sets a property to value
   * concat(extraMethods, extraProperties) - adds methods + properties
   * append(e) - combines two environemts, biased to `e`
**/
function environment(methods, properties) {
    var i;

    if(!(this instanceof environment) || (typeof this.method != 'undefined' && typeof this.property != 'undefined'))
        return new environment(methods, properties);

    methods = methods || {};
    properties = properties || {};

    this.method = curry(function(name, predicate, f) {
        var newMethods = extend(methods, singleton(name, (methods[name] || []).concat({
            predicate: predicate,
            f: f
        })));
        return environment(newMethods, properties);
    });

    this.property = curry(function(name, value) {
        var newProperties = extend(properties, singleton(name, value));
        return environment(methods, newProperties);
    });

    this.concat = function(extraMethods, extraProperties) {
        var newMethods = {},
            newProperties = {},
            i;

        for(i in methods) {
            newMethods[i] = methods[i].concat(extraMethods[i]);
        }
        for(i in extraMethods) {
            if(i in newMethods) continue;
            newMethods[i] = extraMethods[i];
        }

        return environment(
            newMethods,
            extend(properties, extraProperties)
        );
    };

    this.append = function(e) {
        return e.concat(methods, properties);
    };

    for(i in methods) {
        if(this[i]) throw new Error("Method " + i + " already in environment.");
        this[i] = makeMethod(methods[i]);
    }

    for(i in properties) {
        if(this[i]) throw new Error("Property " + i + " already in environment.");
        this[i] = properties[i];
    }
}
