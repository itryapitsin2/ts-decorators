import {WARNING_COLOR} from "../types";

/**
 * Write into console Deprecated warning for a property
 * @param enabled: set false in production mode
 */
export function deprecated(enabled: boolean = true): PropertyDecorator {
    return function(target: Object, propertyKey: string) {
        if (!enabled) {
            return;
        }
        let value = target[propertyKey];
        Reflect.defineProperty(target, propertyKey, {
            get: () =>  {
                console.log(
                    `%c "${propertyKey}" field is marked as 💩 (deprecated)`,
                    `color: ${WARNING_COLOR}`);
                return value;
            },
            set: (val) => {
                console.log(
                    `%c "${propertyKey}" field is marked as 💩 (deprecated)`,
                    `color: ${WARNING_COLOR}`);
                value = val;
            }
        });
    }
}
