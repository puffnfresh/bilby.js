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
    var self = getInstance(this, done);
    self.isDone = true;
    self.result = result;
    return self;
}

/**
   ## cont(thunk)

   Continuation constructor. `thunk` is a nullary closure, resulting
   in a `done` or a `cont`.
**/
function cont(thunk) {
    var self = getInstance(this, cont);
    self.isDone = false;
    self.thunk = thunk;
    return self;
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
