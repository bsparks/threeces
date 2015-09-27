export interface IComponent {}

export var ComponentRegistry = {};

// decorator
export function Component(name: string): ClassDecorator {
    return function(target: any) {
        Object.defineProperty(target.prototype, '$name', {
            value: name,
            enumerable: true,
            writable: false
        });
        ComponentRegistry[name] = target;
    };
}