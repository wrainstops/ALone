import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

export default class Application {
  constructor(options) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
    this.scene.fog = new THREE.Fog(0x88ccee, 0, 50);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.fillLight = new THREE.HemisphereLight(0x8dc1de, 0x00668d, 1.5);
    this.fillLight.position.set(2, 1, 1);
    this.scene.add(this.fillLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
    this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight);

    this.canvas = options.canvas;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.render(this.scene, this.camera);

    const loader = new GLTFLoader().setPath('/public/gltf/map/');
    loader.load('map.gltf', (gltf) => {
      this.scene.add(gltf.scene);
      this.renderer.render(this.scene, this.camera);
    });

    document.body.addEventListener('mousemove', (event) => {
      if (document.pointerLockElement === document.body) {
        this.camera.rotation.y -= event.movementX / 500;
        this.camera.rotation.x -= event.movementY / 500;
      }
    });
  }
}