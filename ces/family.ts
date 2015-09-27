import {Entity} from './entity';
import {EntityList} from './entityList';
import {SyncEvent} from 'ts-events';

export class Family {
    entities: EntityList;

    constructor(...componentNames) {

    }

    addEntity(entity: Entity) {
        if (!this.entities.has(entity)) {
            this.entities.add(entity);
        }
    }

    getEntities(): Array<Entity> {
        return this.entities.toArray();
    }

    forEach(callback: Function, reversed?: boolean) {
        this.entities.forEach(callback, reversed);
    }
}