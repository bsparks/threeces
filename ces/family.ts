/// <reference path="../typings/ts-events/ts-events.d.ts" />

import {Entity} from './entity';
import {EntityList} from './entityList';
import {SyncEvent} from 'ts-events';

export class Family {
    entities: EntityList;

    onAddEntity: SyncEvent<Entity>;
    onRemoveEntity: SyncEvent<Entity>;

    private _allOfComponents: string[];
    private _anyOfComponents: string[];
    private _noneOfComponents: string[];

    constructor(..._componentNames: string[]) {
        this.entities = new EntityList();
        this.onAddEntity = new SyncEvent<Entity>();
        this.onRemoveEntity = new SyncEvent<Entity>();

        this.assignTaxonomy(_componentNames);
    }

    assignTaxonomy(taxonomy: string[]) {
        this._allOfComponents = taxonomy.filter(function(name) {
            return (name.substr(0, 1) !== '!' && name.substr(0, 1) !== '?');
        });

        this._noneOfComponents = taxonomy.filter(function(name) {
            return (name.substr(0, 1) === '!');
        }).map(function(name) {
            return name.substr(1);
        });

        this._anyOfComponents = taxonomy.filter(function(name) {
            return (name.substr(0, 1) === '?');
        }).map(function(name) {
            return name.substr(1);
        });
    }

    addEntity(entity: Entity): boolean {
        return this._checkEntity(entity);
    }

    removeEntity(entity: Entity): boolean {
        return this._removeEntity(entity);
    }

    private _addEntity(entity: Entity): boolean {
        if (!this.entities.has(entity)) {
            this.entities.add(entity);
            this.onAddEntity.post(entity);

            return true;
        }

        return false;
    }

    private _removeEntity(entity: Entity): boolean {
        if (this.entities.has(entity)) {
            this.entities.remove(entity);
            this.onRemoveEntity.post(entity);

            return true;
        }

        return false;
    }

    getEntities(): Array<Entity> {
        return this.entities.toArray();
    }

    forEach(callback: Function, reversed?: boolean) {
        this.entities.forEach(callback, reversed);
    }

    private _checkEntity(entity: Entity, components?: string[]) {
        var contains = this.entities.has(entity),
            interested = true;

        components = components || entity.getComponentNames();

        if (this._allOfComponents.length > 0) {
            interested = this._allOfComponents.every(function(component) {
                return components.indexOf(component) >= 0;
            });
        }

        if (this._noneOfComponents.length > 0 && interested) {
            interested = this._noneOfComponents.every(function(component) {
                return components.indexOf(component) < 0;
            });
        }

        if (this._anyOfComponents.length > 0 && interested) {
            interested = this._anyOfComponents.some(function(component) {
                return components.indexOf(component) >= 0;
            });
        }

        if (contains && !interested) {
            this._removeEntity(entity);
        } else if (!contains && interested) {
            this._addEntity(entity);
        }

        return interested;
    }
}