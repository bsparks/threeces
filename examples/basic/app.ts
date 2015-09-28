/// <reference path="../../typings/tsd.d.ts" />

import {ISystem} from 'ces/system';
import {IComponent, Component, ComponentManager} from 'ces/component';
import {World} from 'ces/world';
import * as THREE from 'three';
import {Timer, Timing} from '../../util/timer';

@Component('health')
class HealthComponent implements IComponent {
    constructor(public health: number, public max: number) {

    }
}

window.foo = new HealthComponent(8,8);
console.debug('C: ', window.foo);
console.debug('R: ', ComponentManager, ComponentManager.registry, ComponentManager.registry.size());

class TestSystem implements ISystem {
    world: World;
    num: number = 0;

    timer: Timer;

    addedToWorld(world: World) {
        this.world = world;
        this.timer = new Timer(3);
    }

    removedFromWorld() {
        this.world = null;
    }

    update(delta: number) {
        //console.debug('delta: ', delta);
        if (this.timer && this.timer.isExpired) {
            this.timer.reset();
            console.debug('Time! ', this.timer, ' >> ', Timing);
        }
    }
}

var world = window.world = new World();
world.addSystem(new TestSystem());

class App {
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;

    private cube: THREE.Mesh;

    constructor(private _container: string) {
        this.initTHREE();
        this.initScene();
        this.render();
    }

    private initTHREE(): void {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.scene.add(this.camera);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById(this._container).appendChild(this.renderer.domElement);
    }

    private initScene(): void {
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);

        this.camera.position.z = 5;
    }

    public render(): void {
        requestAnimationFrame(() => this.render());

        this.cube.rotation.x += 0.1;
        this.cube.rotation.y += 0.1;

        this.renderer.render(this.scene, this.camera);

        Timing.step();

        world.update(Timing.frameTime);
    }
}

var foo = new App('content');