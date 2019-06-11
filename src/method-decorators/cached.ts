interface CacheItem {
    value: string;
    createdDate: Date;
}

/**
 * Cache method call by params
 */
export function cached() {
    return function(target: any, _methodName: string, descriptor: PropertyDescriptor) {
        let method = descriptor.value;
        const cache: Map<string, CacheItem> = new Map<string, CacheItem>();
        descriptor.value = function() {
            const key = JSON.stringify(arguments);
            if (cache.has(key)) {
                return cache.get(key).value;
            }

            const result = Reflect.apply(method, target, arguments);
            cache.set(key, { value: result, createdDate: new Date() });

            return result;
        };
        return descriptor;
    };
}
