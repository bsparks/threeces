import {HashMap, Map} from '../collections/map';
import {IComponent} from './component';

export class Entity {
    id: number;
    uuid: string;
    name: string;

    protected _components: Map<string, IComponent>;

    constructor() {
        this._components = new HashMap<string, IComponent>();
    }

    getComponentNames(): string[] {
        return this._components.keys();
    }
}