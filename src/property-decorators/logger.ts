import {INFO_COLOR} from "../types";

/**
 * Write into console changes in property
 * @param enabled: set false in production mode
 */
export function logger(enabled: boolean = true): PropertyDecorator {
    return function(target: Object, propertyKey: string) {
        if (!enabled) {
            return;
        }
        let value = target[propertyKey];
        Reflect.defineProperty(target, propertyKey, {
            get: () =>  {
                console.log(
                    `%c Getting value for field "${propertyKey}": ${value}`,
                    `color: ${INFO_COLOR}`);
                return value;
            },
            set: (val) => {
                console.log(
                    `%c Setting value for field "${propertyKey}": ${val}`,
                    `color: ${INFO_COLOR}`);
                value = val;
            }
        });
    }
}
