function generateInputs(env, args, size) {
    return env['<'](args, function(arg) {
        return env.arb(arg, size);
    });
}

function successReporter() {
    if(!(this instanceof successReporter))
        return new successReporter();

    this.success = true;
    this.fold = function(a, b) {
        return a;
    };
}

function failureReporter(inputs, tries) {
    if(!(this instanceof failureReporter))
        return new failureReporter(inputs, tries);

    this.success = false;
    this.fold = function(a, b) {
        return b(inputs, tries);
    };
}

function findSmallest(env, property, inputs) {
    var shrunken = env['<'](inputs, env.shrink),
        smallest = [].concat(inputs),
        args,
        i,
        j;

    for(i = 0; i < shrunken.length; i++) {
        args = [].concat(smallest);
        for(j = 0; j < shrunken[i].length; j++) {
            args[i] = shrunken[i][j];
            if(property.apply(this, args))
                break;
            smallest[i] = shrunken[i][j];
        }
    }

    return smallest;
}

function forAll(property, args) {
    var inputs,
        i;

    for(i = 0; i < this.goal; i++) {
        inputs = generateInputs(this, args, i);
        if(!property.apply(this, inputs))
            return failureReporter(
                findSmallest(this, property, inputs),
                i
            );
    }

    return successReporter();
}

bilby = bilby
    .property('forAll', forAll)
    .property('goal', 100);
