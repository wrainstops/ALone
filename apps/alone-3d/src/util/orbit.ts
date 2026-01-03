import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export default class CustomOrbitControls extends OrbitControls {
  constructor(camera: THREE.PerspectiveCamera, canvas: HTMLCanvasElement) {
    super(camera, canvas);

    this.target.set(0, 1, 0);
    // 开启惯性
    this.enableDamping = true;
    // 关闭右键/shift拖拽
    this.enablePan = false;
    // 限制相机垂直旋转角度
    this.maxPolarAngle = Math.PI / 2 - 0.05;

    this.update();
  }
}
