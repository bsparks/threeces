export interface ILinkedListNode<T> {
    element: T;
    prev: ILinkedListNode<T>;
    next: ILinkedListNode<T>;
}

export class LinkedList<T> {
    head: ILinkedListNode<T>;
    tail: ILinkedListNode<T>;

    size: number;

    constructor() {
        this.head = this.tail = null;
        this.size = 0;
    }

    private createNode(item: T): ILinkedListNode<T> {
        return {
            element: item,
            prev: null,
            next: null
        };
    }

    add(item: T) {
        var node = this.createNode(item);

        this.addNode(node);

        return node;
    }

    addNode(node: ILinkedListNode<T>) {
        if (this.head === null) {
            this.head = this.tail = node;
        } else {
            node.prev = this.tail;
            this.tail.next = node;
            this.tail = node;
        }

        this.size++;
    }

    contains(item: T) {
        var node = this.head;

        while (node) {
            if (node.element === item) {
                return true;
            }
        }

        return false;
    }

    remove(item: T) {
        var node = this.head;

        while (node) {
            if (node.element === item) {
                this.removeNode(node);
                break;
            }

            node = node.next;
        }
    }

    removeNode(node: ILinkedListNode<T>) {
        if (node.prev === null) {
            this.head = node.next;
        } else {
            node.prev.next = node.next;
        }

        if (node.next === null) {
            this.tail = node.prev;
        } else {
            node.next.prev = node.prev;
        }

        this.size--;
    }

    clear() {
        this.head = this.tail = null;
        this.size = 0;
    }

    isEmpty() {
        return this.size === 0;
    }

    toArray(): Array<T> {
        var array, node;

        array = [];
        for (node = this.head; node; node = node.next) {
            array.push(node.element);
        }

        return array;
    }

    forEach(callback: Function, reversed?: boolean) {
        var currentNode = reversed ? this.tail : this.head;
        while (currentNode !== null) {
            if (callback(currentNode.element) === false) {
                break;
            }
            currentNode = reversed ? currentNode.prev : currentNode.next;
        }
    }
}