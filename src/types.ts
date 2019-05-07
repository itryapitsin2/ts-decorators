// 6.1.1 The Undefined Type
// https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
export function IsUndefined(x: any) {
    return x === undefined;
}
// 6.1.2 The Null Type
// https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
export function IsNull(x: any) {
    return x === null;
}
// 6.1.5 The Symbol Type
// https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
export function IsSymbol(x: any) {
    return typeof x === 'symbol';
}
// 6.1.7 The Object Type
// https://tc39.github.io/ecma262/#sec-object-type
export function IsObject(x: any) {
    return typeof x === 'object' ? x !== null : typeof x === 'function';
}

export function IsFunction(x: any) {
    return typeof x === 'function';
}

export function IsString(x: any) {
    return typeof x === 'string';
}

export function IsNumber(x: any) {
    return typeof x === 'number';
}

export interface Lambda {
    (): void;
    name?: string;
}

export interface Lambda1<T> {
    (arg1: T): void;
    name?: string;
}

export const INFO_COLOR = '#208BDA';
export const WARNING_COLOR = '#DA940B';
