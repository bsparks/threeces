/// <reference path="../typings/ts-events/ts-events.d.ts" />

import {Map, HashMap} from '../collections/map';
import {LinkedList} from '../collections/linkedList';
import {Family} from './family';
import {EntityList} from './entityList';
import {Entity} from './entity';
import {ISystem} from './system';
import {SyncEvent, QueuedEvent, flush} from 'ts-events';

export class World {
    private _systems: Map<string, ISystem>;
    private _entities: EntityList;
    private _families: Map<string, Family>;

    entityRemoved: QueuedEvent<Entity>;

    constructor() {
        this._entities = new EntityList();
        this._families = new HashMap<string, Family>();
        this._systems = new HashMap<string, ISystem>();

        this.entityRemoved.attach(this, this._onRemoveEntity);
    }

    addSystem(system: ISystem, id?: string) {
        this._systems.put(id, system);
    }

    removeSystem(system: ISystem) {
        this._systems.removeByValue(system);
    }

    addEntity(entity: Entity) {
        this._families.forEach(family => family.addEntity(entity));
        this._entities.add(entity);
    }

    removeEntity(entity: Entity) {
        this.entityRemoved.post(entity);
    }

    private _onRemoveEntity(entity: Entity) {
        this._families.forEach(family => family.removeEntity(entity));
        this._entities.remove(entity);
    }

    update(dt: number): void {
        this._systems.forEach(system => system.update(dt));

        // flush out the event queue (for removed entities)
        flush();
    }

    getFamily(...taxonomy: string[]): Family {
        let family: Family;
        let key: string = taxonomy.join(',');

        if (this._families.containsKey(key)) {
            family = this._families.get(key);
        } else {
            family = new Family();
            family.assignTaxonomy(taxonomy);
            this._families.put(key, family);
        }

        return family;
    }
}