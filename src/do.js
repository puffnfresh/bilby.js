/**
   # Do (operator overloading)

   Adds operator overloading for functional syntax:

     * `>=` - monads:

           bilby.Do()(
               bilby.some(1) >= function(x) {
                   return x < 0 ? bilby.none : bilby.some(x + 2);
               }
           ).getOrElse(0) == 3;

     * `>>` - kleislis:

           bilby.Do()(
               function(x) {
                   return x < 0 ? bilby.none : bilby.some(x + 1);
               } >> function(x) {
                   return x % 2 != 0 ? bilby.none : bilby.some(x + 1);
               }
           )(1).getOrElse(0) == 3;

     * `<` - functors:

           bilby.Do()(
               bilby.some(1) < add(2)
           ).getOrElse(0) == 3;

     * `*` - applicatives:

           bilby.Do()(
               bilby.some(add) * bilby.some(1) * bilby.some(2)
           ).getOrElse(0) == 3;

     * `+` - semigroups:

           bilby.Do()(
               bilby.some(1) + bilby.some(2)
           ).getOrElse(0) == 3;
**/

// Gross mutable global
var doQueue;

/**
   ## Do()(a)

   Creates a new syntax scope. The `a` expression is allowed multiple
   usages of a single operator per `Do` call:

   * `>=`
   * `>>`
   * `<`
   * `*`
   * `+`

   The string name of the operator will be called on the bilby
   environment with the operands, for example:

       bilby.Do()(bilby.some(1) + bilby.some(2))

   Will desugar into:

       bilby['+'](bilby.some(1), bilby.some(2))
**/
function Do() {
    if(arguments.length)
        throw new TypeError("Arguments given to Do. Proper usage: Do()(arguments)");

    var env = this,
        oldDoQueue = doQueue;

    doQueue = [];
    return function(n) {
        var op, x, i;
        if(!doQueue.length) {
            doQueue = oldDoQueue;
            return n;
        }

        if(n === true) op = '>=';
        if(n === false) op = '<';
        if(n === 0) op = '>>';
        if(n === 1) op = '*';
        if(n === doQueue.length) op = '+';

        if(!op) {
            doQueue = oldDoQueue;
            throw new Error("Couldn't determine Do operation. Could be ambiguous.");
        }

        x = doQueue[0];
        for(i = 1; i < doQueue.length; i++) {
            x = env[op](x, doQueue[i]);
        }

        doQueue = oldDoQueue;
        return x;
    };
}

/**
   ## Do.setValueOf(proto)

   Used to mutate the `valueOf` property on `proto`. Necessary to do
   the `Do` block's operator overloading. Uses the object's existing
   `valueOf` if not in a `Do` block.

   *Warning:* this mutates `proto`. May not be safe, even though it
   tries to default back to the normal behaviour when not in a `Do`
   block.
**/
Do.setValueOf = function(proto) {
    var oldValueOf = proto.valueOf;
    proto.valueOf = function() {
        if(doQueue === undefined)
            return oldValueOf.call(this);

        doQueue.push(this);
        return 1;
    };
};

bilby = bilby.property('Do', Do);
