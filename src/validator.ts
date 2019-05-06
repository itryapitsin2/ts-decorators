import "reflect-metadata";
import {Lambda1} from "./types";

type StringLengthMetadataType = {
    idx: number,
    length: number
}

const requiredMetadataKey = Symbol("required");
const maxLengthMetadataKey = Symbol("max-length");
const minLengthMetadataKey = Symbol("min-length");

/**
 * Protect function parameter from null or undefined
 * @param target A class of method
 * @param propertyKey A method name
 * @param parameterIndex Index number of decorated parameter
 */
function notNull(target: any,
                 propertyKey: string | symbol,
                 parameterIndex: number) {
    let existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
    existingRequiredParameters.push(parameterIndex);
    Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
}

/**
 * Protect function parameter from minimal string length
 * @param min: minimum value of string length
 */
function minLength(min: number): ParameterDecorator {
    return (target: Object,
            propertyKey: string | symbol,
            parameterIndex: number): void => {
        let existingMinLengthParameters: StringLengthMetadataType[] = Reflect.getOwnMetadata(
            minLengthMetadataKey,
            target,
            propertyKey) || [];
        existingMinLengthParameters.push({idx: parameterIndex, length: min});
        Reflect.defineMetadata(
            minLengthMetadataKey,
            existingMinLengthParameters,
            target,
            propertyKey);
    };
}

/**
 * Protect function parameter from maximal string length
 * @param max: maximum value of string length
 */
function maxLength(max: number): ParameterDecorator {
    return (target: Object,
            propertyKey: string | symbol,
            parameterIndex: number): void => {
        let existingMaxLengthParameters: StringLengthMetadataType[] = Reflect.getOwnMetadata(
            maxLengthMetadataKey,
            target,
            propertyKey) || [];
        existingMaxLengthParameters.push({idx: parameterIndex, length: max});
        Reflect.defineMetadata(
            maxLengthMetadataKey,
            existingMaxLengthParameters,
            target,
            propertyKey);
    };
}

/**
 * Test decorated parameters for null or undefined
 * @param target A class of method
 * @param propertyName A method name
 * @param args: A list of parameters in method
 */
function validateNulls(target: any,
                       propertyName: string | symbol,
                       args: IArguments) {
    let requiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName);
    if (requiredParameters) {
        for (let parameterIndex of requiredParameters) {
            if (parameterIndex >= args.length || args[parameterIndex] === undefined || args[parameterIndex] === null) {
                throw new Error(`Missing required argument at ${propertyName.toString()} ${parameterIndex}`);
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
function validateMaxLength(target: any,
                           propertyName: string | symbol,
                           args: IArguments) {
    let maxLengthParameters: StringLengthMetadataType[] = Reflect.getOwnMetadata(maxLengthMetadataKey, target, propertyName);
    if (maxLengthParameters) {
        for (let tpe of maxLengthParameters) {
            if (tpe.idx >= args.length || typeof args[tpe.idx] !== "string" || args[tpe.idx].length > tpe.length) {
                throw new Error("Incorrect string length");
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
function validateMinLength(target: any,
                           propertyName: string | symbol,
                           args: IArguments) {
    let minLengthParameters: StringLengthMetadataType[] = Reflect.getOwnMetadata(minLengthMetadataKey, target, propertyName);
    if (minLengthParameters) {
        for (let tpe of minLengthParameters) {
            if (tpe.idx >= args.length || typeof args[tpe.idx] !== "string" || args[tpe.idx].length <= tpe.length) {
                throw new Error("A ");
            }
        }
    }
}

/**
 *
 * @param target
 * @param propertyName
 * @param descriptor
 */
export function validate(
    target: any,
    propertyName: string | symbol,
    descriptor: PropertyDescriptor
) {
    let method = descriptor.value;
    descriptor.value = function () {
        console.log("Invoking descriptor");
        validateNulls(target, propertyName, arguments);
        validateMaxLength(target, propertyName, arguments);
        validateMinLength(target, propertyName, arguments);

        return Reflect.apply(method, target, arguments);
    };
    return descriptor;
}

/**
 * tryCatch decorator
 * @param func: catch case handler
 */
export function tryCatch(func: Lambda1<Error>) {
    return function (
        target: any,
        propertyName: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        let method = descriptor.value;
        const args = arguments;
        descriptor.value = () => {
            try {
                return Reflect.apply(method, target, args);
            } catch (e) {
                func(e);
            }
        };
        return descriptor;
    }
}

validate.notNull = notNull;
validate.maxLength = maxLength;
validate.minLength = minLength;
