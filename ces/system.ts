import {World} from './world';

export interface ISystem {
    world: World;
    update(delta: number) : void;
    addedToWorld(world: World);
    removedFromWorld();
}