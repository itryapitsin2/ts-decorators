import { WARNING_COLOR, Lambda, IsBoolean, IsFunction } from '../types';

/**
 * Write into console Deprecated warning for a property
 * @param enabled: set false in production mode
 */
export function deprecated(enabled: Lambda<boolean> | boolean = (): boolean => { return true; }): PropertyDecorator {
    return function(target: Record<string, any>, propertyKey: string): void {
        if (IsBoolean(enabled) && !enabled) {
            return;
        }
        // @ts-ignore
        if (IsFunction(enabled) && !enabled()) {
            return;
        }
        let value = target[propertyKey];
        Reflect.defineProperty(target, propertyKey, {
            get: () => {
                console.log(
                    `%c "${propertyKey}" field is marked as 💩 (deprecated)`,
                    `color: ${WARNING_COLOR}`,
                );
                return value;
            },
            set: value_ => {
                console.log(
                    `%c "${propertyKey}" field is marked as 💩 (deprecated)`,
                    `color: ${WARNING_COLOR}`,
                );
                value = value_;
            },
        });
    };
}
