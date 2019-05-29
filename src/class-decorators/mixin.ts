import {Constructor, Mixin} from "../types";

function getPropertyDescriptorMap(clientKeys: string[],
                                  obj: object): PropertyDescriptorMap {
    const map: PropertyDescriptorMap = {};
    Object.getOwnPropertyNames(obj).forEach(key => {
        if (clientKeys.indexOf(key) < 0) {
            const descriptor = Object.getOwnPropertyDescriptor(obj, key);
            if (descriptor === undefined) {
                return;
            }
            if (descriptor.get || descriptor.set) {
                map[key] = descriptor;
            } else if (typeof descriptor.value === "function") {
                map[key] = descriptor;
            }
        }
    });
    return map;
}

/**
 * Returns a map of mixables. That is things that can be mixed in
 */
function getMixables(clientKeys: string[], mixin: Mixin<any>) {
    let descriptors: PropertyDescriptorMap = {};
    switch (typeof mixin) {
        case "object":
            descriptors = getPropertyDescriptorMap(clientKeys, mixin);
            break;
        case "function":
            descriptors = getPropertyDescriptorMap(clientKeys, (mixin as Constructor<any>).prototype);
            break;
    }
    return descriptors;
}

function mix(client: Constructor<any>, mixins: Mixin<any>[]) {
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
    return function (target: any) {
        mix(target, options.reverse());
    }
}
