import 'reflect-metadata';
import {IsNullOrUndefined, IsPrimitive, IsString} from '../types';

const jsonMetadataKey = 'json-property';

export interface JsonMetaData<T> {
    name?: string;

    clazz?: { new(): T }
}

export function jsonProperty<T>(metadata?: JsonMetaData<T> | string): any {
    return function(target: Record<string, any>, propertyKey: string): void {
        if (IsNullOrUndefined(metadata)) {
            return Reflect.defineMetadata(jsonMetadataKey, {
                name: propertyKey,
                clazz: undefined
            }, target, propertyKey);
        } else if (IsString(metadata)) {
            return Reflect.defineMetadata(jsonMetadataKey, {
                name: metadata,
                clazz: undefined
            }, target, propertyKey);
        } else {
            let metadataObject = metadata as JsonMetaData<T>;
            return Reflect.defineMetadata(jsonMetadataKey, {
                name: metadataObject ? metadataObject.name : propertyKey,
                clazz: metadataObject ? metadataObject.clazz : undefined
            }, target, propertyKey);
        }
    };
}

export function getClazz(target: any, propertyKey: string): any {
    return Reflect.getMetadata('design:type', target, propertyKey);
}

export function getJsonProperty<T>(target: any, propertyKey: string): JsonMetaData<T> {
    return Reflect.getMetadata(jsonMetadataKey, target, propertyKey);
}

const propertyMetadataFn: (IJsonMetaData, jsonObject, target, propertyKey) => any = (propertyMetadata, jsonObject, target: any, propertyKey: string) => {
    let propertyName = propertyMetadata.name || propertyKey;
    let innerJson = jsonObject
        ? jsonObject[propertyName]
        : undefined;

    let clazz = getClazz(target, propertyKey);
    if (!IsPrimitive(clazz)) {
        return deserialize(clazz, innerJson);
    } else {
        return jsonObject ? jsonObject[propertyName] : undefined;
    }
};

export function deserialize<T>(clazz: { new(): T }, jsonObject: any): T {
    if (!clazz || !jsonObject) {
        return undefined;
    }

    let obj = new clazz();

    Object.keys(obj).forEach((key) => {
        let propertyMetadata: JsonMetaData<T> = getJsonProperty(obj, key);
        if (propertyMetadata) {
            obj[key] = propertyMetadataFn(propertyMetadata, jsonObject, obj, key);
        } else {
            if (jsonObject && jsonObject[key] !== undefined) {
                obj[key] = jsonObject[key];
            }
        }
    });
    return obj;
}

export function serialize<T>(clazz: T): any {
    if (!clazz) {
        return undefined;
    }

    const json: Record<string, any> = {};

    Object.keys(clazz).forEach((key) => {
        let propertyMetadata: JsonMetaData<T> = getJsonProperty(clazz, key);
        console.log(`${key}: ${propertyMetadata.name}`);
        json[propertyMetadata.name] = clazz[key];
    });
    return json;
}
