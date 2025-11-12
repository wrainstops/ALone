import * as THREE from "three";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";
import {
  PerspectiveCamera,
  PerspectiveCameraPosition,
  SceneBackgroundColor,
  Fog,
  DirectionalLight,
  DirectionalLightPosition,
  settings,
  controls,
} from "@/constant/application";
import CustomModel from "@/util/model";
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

  // loadModel
  private loadModel!: CustomModel;

  // floor
  private floor!: THREE.Mesh;

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
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setAnimationLoop(this.animate.bind(this));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.5;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.render(this.scene, this.camera);

    // orbitControls
    this.orbitControls = new CustomOrbitControls(this.camera, this.canvas);

    window.addEventListener("resize", this.onWindowResize.bind(this));
    document.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener("keyup", this.onKeyUp.bind(this));

    new HDRLoader().setPath("/walk/").load("lobe.hdr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.environment = texture;
      this.scene.environmentIntensity = 1.5;

      // loadModel
      this.loadModel = new CustomModel(this.group, this.scene);
      this.animate();
      this.addFloor();
    });
  }

  addFloor() {
    const size = 50;
    const repeat = 16;

    const maxAnisotropy = this.renderer.capabilities.getMaxAnisotropy();

    const floorT = new THREE.TextureLoader().load("/walk/floor_diffuse.jpg");
    floorT.colorSpace = THREE.SRGBColorSpace;
    floorT.repeat.set(repeat, repeat);
    floorT.wrapS = floorT.wrapT = THREE.RepeatWrapping;
    floorT.anisotropy = maxAnisotropy;

    const floorN = new THREE.TextureLoader().load("/walk/floor_normal.jpg");
    floorN.repeat.set(repeat, repeat);
    floorN.wrapS = floorN.wrapT = THREE.RepeatWrapping;
    floorN.anisotropy = maxAnisotropy;

    const mat = new THREE.MeshStandardMaterial({
      map: floorT,
      normalMap: floorN,
      normalScale: new THREE.Vector2(0.5, 0.5),
      color: 0x404040,
      depthWrite: false,
      roughness: 0.85,
    });

    const g = new THREE.PlaneGeometry(size, size, 50, 50);
    g.rotateX(-Math.PI / 2);

    this.floor = new THREE.Mesh(g, mat);
    this.floor.receiveShadow = true;
    this.scene.add(this.floor);

    controls.floorDecale = (size / repeat) * 4;

    const bulbGeometry = new THREE.SphereGeometry(0.05, 16, 8);
    const bulbLight = new THREE.PointLight(0xffee88, 2, 500, 2);

    const bulbMat = new THREE.MeshStandardMaterial({
      emissive: 0xffffee,
      emissiveIntensity: 1,
      color: 0x000000,
    });
    bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMat));
    bulbLight.position.set(1, 0.1, -3);
    bulbLight.castShadow = true;
    this.floor.add(bulbLight);
  }

  animate() {
    const delta = this.clock.getDelta();

    this.updateCharacter(delta);

    this.renderer.render(this.scene, this.camera);
  }

  updateCharacter(delta: number) {
    const fade = controls.fadeDuration;
    const key = controls.key;
    const up = controls.up;
    const ease = controls.ease;
    const rotate = controls.rotate;
    const position = controls.position;
    const azimuth = this.orbitControls.getAzimuthalAngle();

    const active = key[0] === 0 && key[1] === 0 ? false : true;
    const play = active ? (key[2] ? "Run" : "Walk") : "Idle";

    // change animation

    if (controls.current != play) {
      const current = this.loadModel.actions![play];
      const old = this.loadModel.actions![controls.current];
      controls.current = play;

      if (settings.fixe_transition) {
        current.reset();
        current.weight = 1.0;
        current.stopFading();
        old.stopFading();
        // synchro if not idle
        if (play !== "Idle")
          current.time =
            old.time * (current.getClip().duration / old.getClip().duration);
        old._scheduleFading(fade, old.getEffectiveWeight(), 0);
        current._scheduleFading(fade, current.getEffectiveWeight(), 1);
        current.play();
      } else {
        this.setWeight(current, 1.0);
        old.fadeOut(fade);
        current.reset().fadeIn(fade).play();
      }
    }

    // move object

    if (controls.current !== "Idle") {
      // run/walk velocity
      const velocity =
        controls.current == "Run"
          ? controls.runVelocity
          : controls.walkVelocity;

      // direction with key
      ease.set(key[1], 0, key[0]).multiplyScalar(velocity * delta);

      // calculate camera direction
      const angle = this.unwrapRad(Math.atan2(ease.x, ease.z) + azimuth);
      rotate.setFromAxisAngle(up, angle);

      // apply camera angle on ease
      controls.ease.applyAxisAngle(up, azimuth);

      position.add(ease);
      this.camera.position.add(ease);

      this.group.position.copy(position);
      this.group.quaternion.rotateTowards(rotate, controls.rotateSpeed);

      this.orbitControls.target.copy(position).add({ x: 0, y: 1, z: 0 });
      this.followGroup.position.copy(position);

      // Move the floor without any limit
      const dx = position.x - this.floor.position.x;
      const dz = position.z - this.floor.position.z;
      if (Math.abs(dx) > controls.floorDecale) this.floor.position.x += dx;
      if (Math.abs(dz) > controls.floorDecale) this.floor.position.z += dz;
    }

    if (this.loadModel?.mixer) this.loadModel?.mixer.update(delta);

    this.orbitControls.update();
  }

  setWeight(action: THREE.AnimationAction, weight: number) {
    action.enabled = true;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(weight);
  }

  unwrapRad(r: number) {
    return Math.atan2(Math.sin(r), Math.cos(r));
  }

  onWindowResize() {
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }

  onKeyDown(e: KeyboardEvent) {
    const key = controls.key;
    switch (e.code) {
      case "ArrowUp":
      case "KeyW":
      case "KeyZ":
        key[0] = -1;
        break;
      case "ArrowDown":
      case "KeyS":
        key[0] = 1;
        break;
      case "ArrowLeft":
      case "KeyA":
      case "KeyQ":
        key[1] = -1;
        break;
      case "ArrowRight":
      case "KeyD":
        key[1] = 1;
        break;
      case "ShiftLeft":
      case "ShiftRight":
        key[2] = 1;
        break;
    }
  }

  onKeyUp(e: KeyboardEvent) {
    const key = controls.key;
    switch (e.code) {
      case "ArrowUp":
      case "KeyW":
      case "KeyZ":
        key[0] = key[0] < 0 ? 0 : key[0];
        break;
      case "ArrowDown":
      case "KeyS":
        key[0] = key[0] > 0 ? 0 : key[0];
        break;
      case "ArrowLeft":
      case "KeyA":
      case "KeyQ":
        key[1] = key[1] < 0 ? 0 : key[1];
        break;
      case "ArrowRight":
      case "KeyD":
        key[1] = key[1] > 0 ? 0 : key[1];
        break;
      case "ShiftLeft":
      case "ShiftRight":
        key[2] = 0;
        break;
    }
  }
}
