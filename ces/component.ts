import {Map, HashMap} from '../collections/map';

export interface IComponent {

}

export class ComponentManager {
    static registry: Map<string, IComponent> = new HashMap<string, IComponent>();
}

// decorator
export function Component(name: string): ClassDecorator {
    return function(target: any) {
        Object.defineProperty(target.prototype, '$name', {
            value: name,
            enumerable: true,
            configurable: false
        });

        ComponentManager.registry.put(name, target);
    };
}