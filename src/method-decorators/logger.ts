/**
 * Log function parameter to console
 * @param target
 * @param key
 * @param index
 */
import { INFO_COLOR } from '../types';

export function logParameter(target: any, key: string, index: number) {
    const metadataKey = `__log_${key}_parameters`;
    if (Array.isArray(target[metadataKey])) {
        target[metadataKey].push(index);
    } else {
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
    const originalMethod = descriptor.value;

    //editing the descriptor/value parameter
    descriptor.value = function(...arguments_: any[]) {
        const metadataKey = `__log_${key}_parameters`;
        const indices = target[metadataKey];

        if (Array.isArray(indices)) {
            for (let i = 0; i < arguments_.length; i++) {
                if (indices.includes(i)) {
                    const argument = arguments_[i];
                    const argumentString = JSON.stringify(argument) || argument.toString();
                    console.log(`%c ${key} arg[${i}]: ${argumentString}`, `color: ${INFO_COLOR}`);
                }
            }
            const result = originalMethod.apply(this, arguments_);
            const r = JSON.stringify(result);
            console.log(`%c Call result: ${key} => ${r}`, `color: ${INFO_COLOR}`);
            return result;
        } else {
            const a = arguments_.map(a => JSON.stringify(a) || a.toString()).join();
            const result = originalMethod.apply(this, arguments_);
            const r = JSON.stringify(result);
            console.log(`%c Call: ${key}(${a}) => ${r}`, `color: ${INFO_COLOR}`);
            return result;
        }
    };

    // return edited descriptor as opposed to overwriting the descriptor
    return descriptor;
}
