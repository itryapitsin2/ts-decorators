// 6.1.1 The Undefined Type
// https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
export function IsUndefined(x: any): boolean {
    return x === undefined;
}
// 6.1.2 The Null Type
// https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
export function IsNull(x: any): boolean {
    return x === null;
}
// 6.1.5 The Symbol Type
// https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
export function IsSymbol(x: any): boolean {
    return typeof x === 'symbol';
}
// 6.1.7 The Object Type
// https://tc39.github.io/ecma262/#sec-object-type
export function IsObject(x: any): boolean {
    return typeof x === 'object' ? x !== null : typeof x === 'function';
}

export function IsFunction(x: any): boolean {
    return typeof x === 'function';
}

export function IsString(x: any): boolean {
    return typeof x === 'string';
}

export function IsBoolean(x: any) {
    return typeof x === 'boolean';
}

export function IsNumber(x: any): boolean {
    return typeof x === 'number';
}

export function IsNotNullAndUndefined(x: any): boolean {
    return !IsUndefined(x) && !IsNull(x);
}

export function IsNullOrUndefined(x: any): boolean {
    return IsUndefined(x) || IsNull(x);
}

export interface Lambda<R = void> {
    (): R;
    name?: string;
}

export interface Lambda1<T, R = void> {
    (arg1: T): R;
    name?: string;
}

export type Constructor<T> = new (...args: any[]) => T;
export type Mixin<T> = Constructor<T> | object;

export const INFO_COLOR = '#208BDA';
export const WARNING_COLOR = '#DA940B';
