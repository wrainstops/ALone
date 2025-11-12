import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export default class CustomOrbitControls extends OrbitControls {
  constructor(camera: THREE.PerspectiveCamera, canvas: HTMLCanvasElement) {
    super(camera, canvas);

    this.target.set(0, 1, 0);
    this.enableDamping = true;
    this.enablePan = false;
    this.maxPolarAngle = Math.PI / 2 - 0.05;

    this.update();
  }
}
