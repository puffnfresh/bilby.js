/**
   # Trampoline

   Reifies continutations onto the heap, rather than the stack. Allows
   efficient tail calls.

   Example usage:

       function loop(n) {
           function inner(i) {
               if(i == n) return bilby.done(n);
               return bilby.cont(function() {
                   return inner(i + 1);
               });
           }

           return bilby.trampoline(inner(0));
       }

   Where `loop` is the identity function for positive numbers. Without
   trampolining, this function would take `n` stack frames.
**/

/**
   ## done(result)

   Result constructor for a continuation.
**/
function done(result) {
    if(!(this instanceof done)) return new done(result);

    this.isDone = true;
    this.result = result;
}

/**
   ## cont(thunk)

   Continuation constructor. `thunk` is a nullary closure, resulting
   in a `done` or a `cont`.
**/
function cont(thunk) {
    if(!(this instanceof cont)) return new cont(thunk);

    this.isDone = false;
    this.thunk = thunk;
}


/**
   ## trampoline(bounce)

   The beginning of the continuation to call. Will repeatedly evaluate
   `cont` thunks until it gets to a `done` value.
**/
function trampoline(bounce) {
    while(!bounce.isDone) {
        bounce = bounce.thunk();
    }
    return bounce.result;
}

bilby = bilby
    .property('done', done)
    .property('cont', cont)
    .property('trampoline', trampoline);
