import {HashMap} from '../collections/map';

export interface IComponent {}

export var ComponentRegistry = new HashMap<string, IComponent>();

// decorator
export function Component(name: string): ClassDecorator {
    return function(target: any) {
        Object.defineProperty(target.prototype, '$name', {
            value: name,
            enumerable: true,
            writable: false
        });
        ComponentRegistry.put(name, target);
    };
}