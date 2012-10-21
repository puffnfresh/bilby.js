function done(result) {
    if(!(this instanceof done)) return new done(result);

    this.isDone = true;
    this.result = result;
}

function cont(thunk) {
    if(!(this instanceof cont)) return new cont(thunk);

    this.isDone = false;
    this.thunk = thunk;
}

function trampoline(bounce) {
    while(true) {
        if(bounce.isDone) {
            return bounce.result;
        }
        bounce = bounce.thunk();
    }
}

bilby = bilby
    .property('done', done)
    .property('cont', cont)
    .property('trampoline', trampoline);
