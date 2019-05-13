import 'reflect-metadata';
import { IsString, Lambda1 } from '../types';

interface StringLengthMetadataType {
    idx: number;
    length: number;
}

interface RegexMetadataType {
    idx: number;
    regex: RegExp;
}

const requiredMetadataKey = Symbol('required');
const maxLengthMetadataKey = Symbol('max-length');
const minLengthMetadataKey = Symbol('min-length');
const regexMetadataKey = Symbol('regex');

export interface RuleFunction {
    (target: any, propertyName: string | symbol, args: IArguments): void;
}

/**
 * Protect function parameter from null or undefined
 * @param target A class of method
 * @param propertyKey A method name
 * @param parameterIndex Index number of decorated parameter
 */
function notNull(target: any, propertyKey: string | symbol, parameterIndex: number) {
    let existingRequiredParameters: number[] =
        Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
    existingRequiredParameters.push(parameterIndex);
    Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
}

/**
 * Protect function parameter from minimal string length
 * @param min: minimum value of string length
 */
function minLength(min: number): ParameterDecorator {
    return (
        target: Record<string, any>,
        propertyKey: string | symbol,
        parameterIndex: number,
    ): void => {
        let existingMinLengthParameters: StringLengthMetadataType[] =
            Reflect.getOwnMetadata(minLengthMetadataKey, target, propertyKey) || [];
        existingMinLengthParameters.push({ idx: parameterIndex, length: min });
        Reflect.defineMetadata(
            minLengthMetadataKey,
            existingMinLengthParameters,
            target,
            propertyKey,
        );
    };
}

/**
 * String parameter should not be empty
 */
const notEmptyString = () => {
    return minLength(1);
};

/**
 * Protect function parameter from maximal string length
 * @param max: maximum value of string length
 */
function maxLength(max: number): ParameterDecorator {
    return (
        target: Record<string, any>,
        propertyKey: string | symbol,
        parameterIndex: number,
    ): void => {
        let existingMaxLengthParameters: StringLengthMetadataType[] =
            Reflect.getOwnMetadata(maxLengthMetadataKey, target, propertyKey) || [];
        existingMaxLengthParameters.push({ idx: parameterIndex, length: max });
        Reflect.defineMetadata(
            maxLengthMetadataKey,
            existingMaxLengthParameters,
            target,
            propertyKey,
        );
    };
}

/**
 * Test a parameter that must matching a pattern
 * @param regex RegExp instance or the regular expression literal
 */
function regex(regex: RegExp | string): ParameterDecorator {
    // @ts-ignore
    const r: RegExp = IsString(regex) ? new RegExp(regex) : regex;

    return (
        target: Record<string, any>,
        propertyKey: string | symbol,
        parameterIndex: number,
    ): void => {
        let existingRegexParameters: RegexMetadataType[] =
            Reflect.getOwnMetadata(regexMetadataKey, target, propertyKey) || [];
        existingRegexParameters.push({ idx: parameterIndex, regex: r });
        Reflect.defineMetadata(regexMetadataKey, existingRegexParameters, target, propertyKey);
    };
}

/**
 * Test a parameter that must matching email pattern
 */
function isEmail(): ParameterDecorator {
    return regex('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$');
}

function customValidator<T>(name: string, data?: T) {
    const nameMetadataKey = Symbol(name);
    return (
        target: Record<string, any>,
        propertyKey: string | symbol,
        parameterIndex: number,
    ): void => {
        let existingCustomParameters: T[] =
            Reflect.getOwnMetadata(nameMetadataKey, target, propertyKey) || [];
        existingCustomParameters.push({ ...data, idx: parameterIndex });
        Reflect.defineMetadata(nameMetadataKey, existingCustomParameters, target, propertyKey);
    };
}

/**
 * Test decorated parameters for null or undefined
 * @param target A class of method
 * @param propertyName A method name
 * @param args: A list of parameters in method
 */
function validateNulls(target: any, propertyName: string | symbol, arguments_) {
    let requiredParameters: number[] = Reflect.getOwnMetadata(
        requiredMetadataKey,
        target,
        propertyName,
    );
    if (requiredParameters) {
        for (let parameterIndex of requiredParameters) {
            if (
                parameterIndex >= arguments_.length ||
                arguments_[parameterIndex] === undefined ||
                arguments_[parameterIndex] === null
            ) {
                throw new Error(
                    `Missing required argument at ${propertyName.toString()} ${parameterIndex}`,
                );
            }
        }
    }
}

/**
 * Test decorated parameters for maximal length
 * @param target A class of method
 * @param propertyName A method name
 * @param args A list of parameters in method
 */
function validateMaxLength(target: any, propertyName: string | symbol, arguments_) {
    let maxLengthParameters: StringLengthMetadataType[] = Reflect.getOwnMetadata(
        maxLengthMetadataKey,
        target,
        propertyName,
    );
    if (maxLengthParameters) {
        for (let tpe of maxLengthParameters) {
            if (
                tpe.idx >= arguments_.length ||
                typeof arguments_[tpe.idx] !== 'string' ||
                arguments_[tpe.idx].length > tpe.length
            ) {
                throw new Error('Incorrect string length');
            }
        }
    }
}

/**
 * Test decorated parameters for minimal length
 * @param target A class of method
 * @param propertyName A method name
 * @param args A list of parameters in method
 */
function validateMinLength(target: any, propertyName: string | symbol, arguments_) {
    let minLengthParameters: StringLengthMetadataType[] = Reflect.getOwnMetadata(
        minLengthMetadataKey,
        target,
        propertyName,
    );
    if (minLengthParameters) {
        for (let tpe of minLengthParameters) {
            if (
                tpe.idx >= arguments_.length ||
                typeof arguments_[tpe.idx] !== 'string' ||
                arguments_[tpe.idx].length <= tpe.length
            ) {
                throw new Error('String is short');
            }
        }
    }
}

/**
 * Test decorated parameters for a pattern
 * @param target A class of method
 * @param propertyName A method name
 * @param args A list of parameters in method
 */
function validateRegex(target: any, propertyName: string | symbol, arguments_) {
    let regexMetadataTypes: RegexMetadataType[] = Reflect.getOwnMetadata(
        regexMetadataKey,
        target,
        propertyName,
    );
    if (regexMetadataTypes) {
        for (let tpe of regexMetadataTypes) {
            if (
                tpe.idx >= arguments_.length ||
                typeof arguments_[tpe.idx] !== 'string' ||
                !tpe.regex.test(arguments_[tpe.idx])
            ) {
                throw new Error('Failed regex at argument');
            }
        }
    }
}

/**
 * Container of rules
 */
export const rulePool: RuleFunction[] = [
    validateNulls,
    validateMaxLength,
    validateMinLength,
    validateRegex,
];

/**
 * Validate method's arguments by rules from rulePool
 * @param target
 * @param propertyName
 * @param descriptor
 */
export function validate(
    target: any,
    propertyName: string | symbol,
    descriptor: PropertyDescriptor,
) {
    let method = descriptor.value;
    descriptor.value = function() {
        const arguments_ = arguments;
        rulePool.forEach(rule => rule(target, propertyName, arguments_));
        return Reflect.apply(method, target, arguments);
    };
    return descriptor;
}

/**
 * tryCatch decorator
 * @param func: catch case handler
 */
export function tryCatch(func: Lambda1<Error>) {
    return function(target: any, propertyName: string | symbol, descriptor: PropertyDescriptor) {
        let method = descriptor.value;
        const arguments_ = arguments;
        descriptor.value = () => {
            try {
                return Reflect.apply(method, target, arguments_);
            } catch (error) {
                func(error);
            }
        };
        return descriptor;
    };
}

validate.notNull = notNull;
validate.maxLength = maxLength;
validate.minLength = minLength;
validate.notEmptyString = notEmptyString;
validate.regex = regex;
validate.isEmail = isEmail;
