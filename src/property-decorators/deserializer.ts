import 'reflect-metadata';
import {IsArray, IsDate, IsNullOrUndefined, IsPrimitive, IsString, Lambda1} from '../types';

const jsonMetadataKey = 'json-property';

export interface JsonMetaData<T> {
    skipped?: boolean;
    name?: string;
    clazz?: {
        new(): T
    }
    fromJson?: Lambda1<Record<string, any>, Function>
    toJson?: Lambda1<T, Record<string, any>>
}

export function jsonField<T>(metadata?: JsonMetaData<T> | string): any {
    return function (target: Record<string, any>, propertyKey: string): void {
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
                ...metadataObject
            }, target, propertyKey);
        }
    };
}

export function serializable(): ClassDecorator {
    return function (ctor: Function): void {

    };
}

export function jsonIgnore(): PropertyDecorator {
    return function (target: Record<string, any>, propertyKey: string): void {
        return Reflect.defineMetadata(jsonMetadataKey, {
            skipped: true,
        }, target, propertyKey);
    };
}

export function getClazz(target: any, propertyKey: string): any {
    return Reflect.getMetadata('design:type', target, propertyKey);
}

export function getJsonProperty<T>(target: any, propertyKey: string): JsonMetaData<T> {
    return Reflect.getMetadata(jsonMetadataKey, target, propertyKey);
}

const propertyMetadataFn: (IJsonMetaData, jsonObject, target, propertyKey) => any = (propertyMetadata, jsonObject, target: any, propertyKey: string): any => {
    let propertyName = propertyMetadata.name || propertyKey;
    let innerJson = jsonObject
        ? jsonObject[propertyName]
        : undefined;

    let clazz = getClazz(target, propertyKey);
    if (IsPrimitive(clazz)) {
        return jsonObject ? jsonObject[propertyName] : undefined;
    } else {
        if (propertyMetadata.fromJson) {
            return deserialize(propertyMetadata.fromJson(innerJson), innerJson);
        } else {
            return deserialize(clazz, innerJson);
        }
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

export function serialize<T>(clazz: T): Record<string, any> {
    if (!clazz) {
        return undefined;
    }

    const json: Record<string, any> = {};

    Object.keys(clazz).forEach((key) => {
        console.log(`Key is ${key}`);
        let propertyMetadata: JsonMetaData<T> = getJsonProperty(clazz, key);
        if (!propertyMetadata) {
            json[key] = clazz[key];

        } else if (IsPrimitive(clazz[key])) {
            console.log('Primitive serialization...');
            json[propertyMetadata.name] = clazz[key];

        } else if (IsArray(clazz[key])) {
            console.log('Array serialization...');
            json[propertyMetadata.name || key] = Array.of(clazz[key]).map((item: any): Record<string, any> => {
                return serialize(item);
            });

        } else if (IsDate(clazz[key])) {
            console.log('Date serialization...');
            const date = clazz[key] as Date;
            json[propertyMetadata.name || key] = date.toJSON();

        } else {
            console.log('Object serialization...');
            let obj = serialize(clazz[key]);
            if (propertyMetadata.toJson) {
                const tpe = propertyMetadata.toJson(clazz[key]);
                obj = {...obj, ...tpe};
            }
            json[propertyMetadata.name || key] = obj;
        }
    });
    return json;
}
