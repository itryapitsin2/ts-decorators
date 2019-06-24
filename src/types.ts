// eslint-disable-next-line import/no-named-as-default
/**
 * Utility functions and types module
 */

/**
 * Test an object for undefined
 *
 * 6.1.1 The Undefined Type https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
 * @param x  tested instance
 */
export function IsUndefined(x: any): boolean {
    return x === undefined;
}

/**
 * Test an object for null
 *
 * 6.1.2 The Null Type
 * https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
 * @param x  tested instance
 */
export function IsNull(x: any): boolean {
    return x === null;
}

/**
 * Test an object for Symbol
 * 6.1.5 The Symbol Type
 * https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
 * @param x  tested instance
 */
export function IsSymbol(x: any): boolean {
    return typeof x === 'symbol';
}

/**
 * Test an object for object and not null
 *
 * 6.1.7 The Object Type
 * https://tc39.github.io/ecma262/#sec-object-type
 * @param x  tested instance
 */
export function IsObject(x: any): boolean {
    return typeof x === 'object' ? x !== null : typeof x === 'function';
}

/**
 * Test an object for object and not null
 *
 * 6.1.7 The Object Type
 * https://tc39.github.io/ecma262/#sec-object-type
 * @param x  tested instance
 */
export function IsFunction(x: any): boolean {
    return typeof x === 'function' || x instanceof Function;
}

/**
 * Test an object for object and not null
 *
 * 6.1.7 The Object Type
 * https://tc39.github.io/ecma262/#sec-object-type
 * @param x  tested instance
 */
export function IsString(x: any): boolean {
    return typeof x === 'string' || x instanceof String;
}

/**
 * Test an object for boolean
 *
 * 6.1.7 The Object Type
 * https://tc39.github.io/ecma262/#sec-object-type
 * @param x  tested instance
 */
export function IsBoolean(x: any) {
    return typeof x === 'boolean' || x instanceof Boolean;
}

/**
 * Test an object for number
 *
 * 6.1.7 The Object Type
 * https://tc39.github.io/ecma262/#sec-object-type
 * @param x  tested instance
 */
export function IsNumber(x: any): boolean {
    return typeof x === 'number' || x instanceof Number;
}

/**
 * Test an object for not null and not undefined
 *
 * 6.1.7 The Object Type
 * https://tc39.github.io/ecma262/#sec-object-type
 * @param x  tested instance
 */
export function IsNotNullAndUndefined(x: any): boolean {
    return !IsUndefined(x) && !IsNull(x);
}

/**
 * Test an object for null or undefined
 *
 * 6.1.7 The Object Type
 * https://tc39.github.io/ecma262/#sec-object-type
 * @param x  tested instance
 */
export function IsNullOrUndefined(x: any): boolean {
    return IsUndefined(x) || IsNull(x);
}

export function IsPrimitive(x: any): boolean {
    return IsString(x) || IsBoolean(x) || IsNumber(x);
}

export function IsArray(object: any): boolean {
    if (object === Array) {
        return true;
    } else {
        return Array.isArray(object);
    }
}

/**
 * Type of lambda expression with single argument
 * @typeparam R Type of outcome result. void type by default.
 * ``` typescript
 * let helloWorldExp: Lambda<string> = (): string => "Hello world";
 * ```
 */
export interface Lambda<R = void> {
    (): R;

    name?: string;
}

/**
 * Type of lambda expression with single argument
 * @typeparam T Type of income argument
 * @typeparam R Type of outcome result. void type by default.
 * ``` typescript
 * let squaringExp: Lambda1<number, number> = (num: number): number => num * num;
 * ```
 */
export interface Lambda1<T, R = void> {
    (arg1: T): R;

    name?: string;
}

/**
 * Constructor for class type
 */
export type Constructor<T> = new (...args: any[]) => T;

/**
 * Type of class mixin
 */
export type Mixin<T> = Constructor<T> | object;

/**
 * Information message color in console
 */
export const INFO_COLOR = '#208BDA';

/**
 * Warning message color in console
 */
export const WARNING_COLOR = '#DA940B';
