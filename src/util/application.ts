import * as THREE from "three";
import {
  PerspectiveCamera,
  PerspectiveCameraPosition,
  SceneBackgroundColor,
  Fog,
  DirectionalLight,
  DirectionalLightPosition,
} from "@/constant/application";
import CustomOrbitControls from "@/util/orbit";
import type { ApplicationOptions } from "#/application";

export default class Application {
  // canvas
  private canvas: HTMLCanvasElement;

  // camera
  private camera: THREE.PerspectiveCamera;

  // clock
  private clock: THREE.Clock;

  // scene
  private scene: THREE.Scene;

  // group
  private group: THREE.Group;

  // followGroup
  private followGroup: THREE.Group;

  // directionalLight
  private directionalLight: THREE.DirectionalLight;

  // renderer
  private renderer: THREE.WebGLRenderer;

  // orbitControls
  private orbitControls: CustomOrbitControls;

  constructor(options: ApplicationOptions) {
    this.canvas = options.canvas;

    // camera
    const { fov, near, far } = PerspectiveCamera;
    const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    const { x = 0, y = 0, z = 0 } = PerspectiveCameraPosition;
    this.camera.position.set(x, y, z);

    // clock
    this.clock = new THREE.Clock();

    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(SceneBackgroundColor);
    this.scene.fog = new THREE.Fog(Fog.color, Fog.near, Fog.far);

    // group
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // followGroup
    this.followGroup = new THREE.Group();
    this.group.add(this.followGroup);

    // directionalLight
    this.directionalLight = new THREE.DirectionalLight(
      DirectionalLight.color,
      DirectionalLight.intensity
    );
    const { x: dlx = 0, y: dly = 0, z: dlz = 0 } = DirectionalLightPosition;
    this.directionalLight.position.set(dlx, dly, dlz);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.set(
      DirectionalLight.shadowMapSizeX,
      DirectionalLight.shadowMapSizeY
    );
    this.followGroup.add(this.directionalLight);
    this.followGroup.add(this.directionalLight.target);

    // renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.renderer.setAnimationLoop(this.animate.bind(this));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.5;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.render(this.scene, this.camera);

    this.orbitControls = new CustomOrbitControls(this.camera, this.canvas);
  }
}
