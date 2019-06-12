import { INFO_COLOR, IsBoolean, IsFunction, Lambda } from '../types';

/**
 * Log function parameter into console
 * @param target
 * @param key
 * @param index
 */
export function logParameter(target: any, key: string, index: number): void {
    const metadataKey = `__log_${key}_parameters`;
    if (Array.isArray(target[metadataKey])) {
        target[metadataKey].push(index);
    } else {
        target[metadataKey] = [index];
    }
}

/**
 * Log method params and result to console
 * @param enabled: set false in production mode
 * ```typescript
 * class MyClass {
 *     @logMethod()
 *     myMethod () {
 *
 *     }
 * }
 * ```
 */
export function logMethod(enabled: boolean | Lambda = true): MethodDecorator {
    return function(target: any, key: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> {
        if (IsBoolean(enabled) && !enabled) {
            return;
        }

        // @ts-ignore
        if (IsFunction(enabled) && !enabled()) {
            return;
        }

        const originalMethod = descriptor.value;

        //editing the descriptor/value parameter
        descriptor.value = function(...arguments_: any[]): any {
            const metadataKey = `__log_${key}_parameters`;
            const indices = target[metadataKey];

            if (Array.isArray(indices)) {
                for (let i = 0; i < arguments_.length; i++) {
                    if (indices.includes(i)) {
                        const argument = arguments_[i];
                        const argumentString = JSON.stringify(argument) || argument.toString();
                        console.log(
                            `%c ℹ️ ${key} arg[${i}]: ${argumentString}`,
                            `color: ${INFO_COLOR}`,
                        );
                    }
                }
                const result = originalMethod.apply(this, arguments_);
                const r = JSON.stringify(result);
                console.log(`%c ℹ️ Call result: ${key} => ${r}`, `color: ${INFO_COLOR}`);
                return result;
            } else {
                const a = arguments_.map(a => JSON.stringify(a) || a.toString()).join();
                const result = originalMethod.apply(this, arguments_);
                const r = JSON.stringify(result);
                console.log(`%c ℹ️ Call: ${key}(${a}) => ${r}`, `color: ${INFO_COLOR}`);
                return result;
            }
        };

        // return edited descriptor as opposed to overwriting the descriptor
        return descriptor;
    };
}
