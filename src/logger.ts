/**
 * Log function parameter to console
 * @param target
 * @param key
 * @param index
 */
export function logParameter(target: any, key : string, index : number) {
    const metadataKey = `__log_${key}_parameters`;
    if (Array.isArray(target[metadataKey])) {
        target[metadataKey].push(index);
    }
    else {
        target[metadataKey] = [index];
    }
}

/**
 * Log method params and result to console
 * @param target
 * @param key
 * @param descriptor
 */
export function logMethod(target, key, descriptor) {

    if(descriptor === undefined) {
        descriptor = Object.getOwnPropertyDescriptor(target, key);
    }
    const originalMethod = descriptor.value;

    //editing the descriptor/value parameter
    descriptor.value = function (...args: any[]) {

        const metadataKey = `__log_${key}_parameters`;
        const indices = target[metadataKey];

        if (Array.isArray(indices)) {
            for (let i = 0; i < args.length; i++) {

                if (indices.indexOf(i) !== -1) {

                    const arg = args[i];
                    const argStr = JSON.stringify(arg) || arg.toString();
                    console.log(`${key} arg[${i}]: ${argStr}`);
                }
            }
            const result =  originalMethod.apply(this, args);
            const r = JSON.stringify(result);
            console.log(`Call result: ${key} => ${r}`);
            return result;
        }
        else {
            const a = args.map(a => (JSON.stringify(a) || a.toString())).join();
            const result = originalMethod.apply(this, args);
            const r = JSON.stringify(result);
            console.log(`Call: ${key}(${a}) => ${r}`);
            return result;
        }
    };

    // return edited descriptor as opposed to overwriting the descriptor
    return descriptor;
}
