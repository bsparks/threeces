import {LinkedList, ILinkedListNode} from '../collections/linkedList';
import {Entity} from './entity';

export class EntityList extends LinkedList<Entity> {
    entities: Object = {};

    add(entity: Entity) {
        var node = super.add(entity);
        this.entities[entity.id] = node;

        return node;
    }

    has(entity: Entity): boolean {
        return this.entities[entity.id] !== undefined;
    }

    remove(entity: Entity) {
        let node = this.entities[entity.id];
        if (node) {
            super.remove(node);
        }
    }

    removeNode(node: ILinkedListNode<Entity>) {
        super.removeNode(node);
        delete this.entities[node.element.id];
    }

    clear() {
        super.clear();
        this.entities = {};
    }
}