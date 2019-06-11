import {Constructor, IsFunction, IsNullOrUndefined, Mixin} from '../types';

function getPropertyDescriptorMap(clientKeys: string[], object): PropertyDescriptorMap {
    const map: PropertyDescriptorMap = {};

    Object.getOwnPropertyNames(object).map(key => {
        if (!clientKeys.includes(key)) {
            const descriptor = Object.getOwnPropertyDescriptor(object, key);

            if (IsNullOrUndefined(descriptor)) {
                return;
            }

            if (descriptor.get || descriptor.set || IsFunction(descriptor.value)) {
                map[key] = descriptor;
            }
        }
    });
    return map;
}

/**
 * Returns a map of mixables. That is things that can be mixed in
 */
function getMixables(clientKeys: string[], mixin: Mixin<any>): PropertyDescriptorMap {
    let descriptors: PropertyDescriptorMap = {};
    switch (typeof mixin) {
        case 'object':
            descriptors = getPropertyDescriptorMap(clientKeys, mixin);
            break;
        case 'function':
            descriptors = getPropertyDescriptorMap(
                clientKeys,
                (mixin as Constructor<any>).prototype,
            );
            break;
    }
    return descriptors;
}

export function mix(client: Constructor<any>, mixins: Mixin<any>[]): void {
    const clientKeys = Object.getOwnPropertyNames(client.prototype);
    for (let mixin of mixins) {
        const mixinMixables = getMixables(clientKeys, mixin);
        Object.defineProperties(client.prototype, mixinMixables);
    }
}

/**
 * Takes a list of classes or object literals and adds their methods
 * to the class calling it.
 */
export function mixin(...options: Mixin<any>[]): ClassDecorator {
    return function(target: any): void {
        mix(target, options.reverse());
    };
}
