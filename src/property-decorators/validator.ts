/**
 * Passed value should not be less than minimum
 * @example
 * class TestClass {
 *     @minValue(10)
 *     testValue: number;
 * }
 * @param {number} minValue A minimum value for validation
 */
import { IsString } from '../types';
import {
    MinValueError,
    MaxValueError,
    NullReferenceError,
    MinLengthError,
    MaxLengthError,
    RegExError,
} from '../errors';

export function minValue(minValue: number): PropertyDecorator {
    return function(target: Record<string, any>, propertyKey: string): void {
        delete target[propertyKey];
        Reflect.defineProperty(target, propertyKey, {
            get: (): any => {
                return target['_' + propertyKey];
            },
            set: (value: number): void => {
                if (value < minValue) {
                    throw new MinValueError('minValue error');
                }
                target['_' + propertyKey] = value;
            },
        });
    };
}

/**
 * Passed value should not be greater than minimum
 * @example
 * class TestClass {
 *     @maxValue(10)
 *     testValue: number;
 * }
 * @param {number} maxValue A maximum value for validation
 */
export function maxValue(maxValue: number): PropertyDecorator {
    return function(target: Record<string, any>, propertyKey: string): void {
        delete target[propertyKey];
        Reflect.defineProperty(target, propertyKey, {
            get: (): any => {
                return target['_' + propertyKey];
            },
            set: (value: number): void => {
                if (value > maxValue) {
                    throw new MaxValueError('maxValue error');
                }
                target['_' + propertyKey] = value;
            },
        });
    };
}

/**
 * Passed value should not be null
 * @example
 * class TestClass {
 *     @notNull
 *     testValue: Object;
 * }
 * @param {Object} target An owner of property
 * @param {string} propertyKey Property name
 */
export function notNull(target: Record<string, any>, propertyKey: string): void {
    delete target[propertyKey];
    Reflect.defineProperty(target, propertyKey, {
        get: (): any => {
            return target['_' + propertyKey];
        },
        set: (value: any): void => {
            if (!value) {
                throw new NullReferenceError('null error');
            }
            target['_' + propertyKey] = value;
        },
    });
}

/**
 * Passed value should not be greater than minimum
 * @example
 * class TestClass {
 *     @minLength(10)
 *     testValue: string;
 * }
 * @param {string} min A minimum value
 */
export function minLength(min: number): PropertyDecorator {
    return function(target: Record<string, any>, propertyKey: string): void {
        delete target[propertyKey];
        Reflect.defineProperty(target, propertyKey, {
            get: (): any => {
                return target['_' + propertyKey];
            },
            set: (value: string): void => {
                if (value.length < min) {
                    throw new MinLengthError('min string error');
                }
                target['_' + propertyKey] = value;
            },
        });
    };
}

/**
 * Passed value should not be empty string
 * @example
 * class TestClass {
 *     @notEmptyString()
 *     testValue: string;
 * }
 */
export function notEmptyString(): PropertyDecorator {
    return minLength(1);
}

/**
 * Passed value should not be less than maximum
 * @example
 * class TestClass {
 *     @maxLength(10)
 *     testValue: string;
 * }
 * @param {string} max A maximum value
 */
export function maxLength(max: number): PropertyDecorator {
    return function(target: Record<string, any>, propertyKey: string): void {
        delete target[propertyKey];
        Reflect.defineProperty(target, propertyKey, {
            get: (): any => {
                return target['_' + propertyKey];
            },
            set: (value: string): void => {
                if (value.length > max) {
                    throw new MaxLengthError('max string error');
                }
                target['_' + propertyKey] = value;
            },
        });
    };
}

/**
 * Passed value should be valid in pattern
 * @param {RegExp} regex A matching pattern
 */
export function regex(regex: RegExp | string): PropertyDecorator {
    // @ts-ignore
    const r: RegExp = IsString(regex) ? new RegExp(regex) : regex;

    return function(target: Record<string, any>, propertyKey: string): void {
        delete target[propertyKey];
        Reflect.defineProperty(target, propertyKey, {
            get: (): any => {
                return target['_' + propertyKey];
            },
            set: (value: string): void => {
                if (!r.test(value)) {
                    throw new RegExError('regex pattern error');
                }
                target['_' + propertyKey] = value;
            },
        });
    };
}

/**
 * Test a parameter that must matching email pattern
 */
export function isEmail(): PropertyDecorator {
    return regex('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$');
}
