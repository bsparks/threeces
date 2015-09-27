/// <reference path="../typings/node-uuid/node-uuid.d.ts" />

import * as uuid from 'node-uuid';

export interface Map<K, V> {
    clear();
    containsKey(key: K): boolean;
    containsValue(value: V): boolean;
    get(key: K): V;
    isEmpty(): boolean;
    put(key: K, value: V): void;
    remove(key: K): V;
    removeByValue(value: V): K;
    size(): number;
    values(): Array<V>;
    keys(): Array<K>;
    forEach(callback: Function);
}

function decode(key) {
    switch (typeof key) {
        case 'boolean':
            return '' + key;
        case 'number':
            return '' + key;
        case 'string':
            return '' + key;
        case 'function':
            return key.className || key.name;
        default:
            key.uuid = key.uuid ? key.uuid : uuid.v4();
            return key.uuid
    }
}

export class HashMap<K, V> implements Map<K, V> {
    private _values;
    private _keys;

    constructor() {
        this.clear();
    }

    values(): Array<V> {
        var result = [];
        for (var key in this._values) {
            result.push(this._values[key]);
        }
        return result;
    }

    keys(): Array<K> {
        var result = [];
        for (var key of this._keys) {
            result.push(key);
        }
        return result;
    }

    containsKey(key: K): boolean {
        return decode(key) in this._values;
    }

    containsValue(value: V): boolean {
        for (var key in this._values) {
            if (value === this._values[key]) {
                return true;
            }
        }
        return false;
    }

    get(key: K): V {
        return this._values[decode(key)];
    }

    put(key: K, value: V) {
        var k = decode(key);
        this._values[k] = value;
        this._keys[k] = key;
    }

    remove(key: K): V {
        var k = decode(key);
        var value = this._values[k];
        delete this._values[k];
        delete this._keys[k];
        return value;
    }

    removeByValue(value: V): K {
        var rkey;
        for (var key in this._values) {
            if (value === this._values[key]) {
                rkey = key;
                break;
            }
        }
        if (rkey) {
            this.remove(rkey);
        }

        return rkey;
    }

    size(): number {
        return Object.keys(this._values).length;
    }

    isEmpty(): boolean {
        return this.size() === 0;
    }

    clear() {
        this._keys = {};
        this._values = {};
    }

    forEach(callback: Function) {
        for (var key in this._values) {
            if(callback(this._values[key], key) === false) {
                break;
            }
        }
    }
}