import { WARNING_COLOR } from '..';

/**
 * Write into console Deprecated warning for a property
 * @param enabled: set false in production mode
 */
export function deprecated(enabled: boolean = true): PropertyDecorator {
    return function(target: Record<string, any>, propertyKey: string): void {
        if (!enabled) {
            return;
        }
        let value = target[propertyKey];
        Reflect.defineProperty(target, propertyKey, {
            get: (): any => {
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
