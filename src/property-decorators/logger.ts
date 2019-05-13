import { INFO_COLOR } from '../types';

/**
 * Write into console changes in property
 * @param enabled: set false in production mode
 */
export function logger(enabled: boolean = true): PropertyDecorator {
    return function(target: Record<string, any>, propertyKey: string) {
        if (!enabled) {
            return;
        }
        let value = target[propertyKey];
        Reflect.defineProperty(target, propertyKey, {
            get: () => {
                console.log(
                    `%c ℹ️ Getting value for field "${propertyKey}": ${value}`,
                    `color: ${INFO_COLOR}`,
                );
                return value;
            },
            set: value_ => {
                console.log(
                    `%c ℹ️ Setting value for field "${propertyKey}": ${value_}`,
                    `color: ${INFO_COLOR}`,
                );
                value = value_;
            },
        });
    };
}
