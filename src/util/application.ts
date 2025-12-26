import * as THREE from "three";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";
import {
  PerspectiveCamera,
  PerspectiveCameraPosition,
  Fog,
  DirectionalLight,
  DirectionalLightPosition,
  Controls,
  Floor,
} from "@/constant/application";
import Build from "@/util/build";
import Character from "@/util/character";
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

  // buildGroup
  private buildGroup: THREE.Group;

  // directionalLight
  private directionalLight: THREE.DirectionalLight;

  // renderer
  private renderer: THREE.WebGLRenderer;

  // orbitControls
  private orbitControls: CustomOrbitControls;

  // character
  private character!: Character;

  // build
  private build!: Build;

  // floor
  private floor!: THREE.Mesh;

  // raycaster 光线投射 用于碰撞检测
  private raycaster: THREE.Raycaster;

  // oldPosition 旧的位置 用户碰撞检测后 恢复位置
  private oldPosition: THREE.Vector3 = new THREE.Vector3();

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
    this.scene.fog = new THREE.Fog(Fog.color, Fog.near, Fog.far);

    // group
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // followGroup
    this.followGroup = new THREE.Group();
    this.group.add(this.followGroup);

    // buildGroup
    this.buildGroup = new THREE.Group();
    this.scene.add(this.buildGroup);

    // directionalLight
    this.directionalLight = new THREE.DirectionalLight(
      DirectionalLight.color,
      DirectionalLight.intensity
    );
    const { x: dlx = 0, y: dly = 0, z: dlz = 0 } = DirectionalLightPosition;
    this.directionalLight.position.set(dlx, dly, dlz);
    // 设置物体投射阴影
    this.directionalLight.castShadow = true;
    // 阴影分辨率
    this.directionalLight.shadow.mapSize.set(
      DirectionalLight.shadowMapSizeX,
      DirectionalLight.shadowMapSizeY
    );
    this.followGroup.add(this.directionalLight);
    this.followGroup.add(this.directionalLight.target);

    // raycaster
    this.raycaster = new THREE.Raycaster();

    // renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      // 抗锯齿, 提高渲染质量, 但会影响性能
      antialias: true,
    });
    // 像素比, 适应高分辨率屏幕
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // 渲染器尺寸, 设置为canvas尺寸
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    // 渲染循环
    this.renderer.setAnimationLoop(this.animate.bind(this));
    // 高质量色调映射, 高质量, 真实感视觉效果
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // 曝光值
    this.renderer.toneMappingExposure = 0.5;
    // 开启阴影配置
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // 背景透明
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.render(this.scene, this.camera);

    // orbitControls
    this.orbitControls = new CustomOrbitControls(this.camera, this.canvas);

    window.addEventListener("resize", this.onWindowResize.bind(this));
    document.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener("keyup", this.onKeyUp.bind(this));
    document.addEventListener("mousedown", this.onMouseDown.bind(this));
    document.addEventListener("mouseup", this.onMouseUp.bind(this));

    // hdr环境贴图
    new HDRLoader().setPath("/hdr/").load("sky.hdr", (texture) => {
      // 设置映射模式, 渲染反射效果
      texture.mapping = THREE.EquirectangularReflectionMapping;
      // 将环境贴图加到场景
      this.scene.environment = texture;
      this.scene.background = texture;
      // 环境贴图强度
      this.scene.environmentIntensity = 1.5;

      // character
      this.character = new Character(this.group);

      // build
      this.build = new Build(this.buildGroup);

      this.animate();
      this.addFloor();
    });
  }

  addFloor() {
    const {
      size,
      repeat,
      normalMapScale,
      meshColor,
      roughness,
      widthSegments,
      heightSegments,
    } = Floor;

    // 获取最大可用各向异性
    const maxAnisotropy = this.renderer.capabilities.getMaxAnisotropy();

    // 纹理贴图 漫反射
    const floorD = new THREE.TextureLoader().load("/floor/floor_diffuse.jpg");
    // 颜色空间, 确保颜色正确渲染
    floorD.colorSpace = THREE.SRGBColorSpace;
    floorD.repeat.set(repeat, repeat);
    // 纹理在水平方向上包裹方式, 纹理在垂直方向上包裹方式, 均设置为重复平铺
    floorD.wrapS = floorD.wrapT = THREE.RepeatWrapping;
    // 纹理的各向异性过滤
    floorD.anisotropy = maxAnisotropy;

    // 纹理贴图 法线
    const floorN = new THREE.TextureLoader().load("/floor/floor_normal.jpg");
    floorN.repeat.set(repeat, repeat);
    // 纹理在水平方向上包裹方式, 纹理在垂直方向上包裹方式, 均设置为重复平铺
    floorN.wrapS = floorN.wrapT = THREE.RepeatWrapping;
    // 纹理的各向异性过滤
    floorN.anisotropy = maxAnisotropy;

    // 标准网格材质
    const mat = new THREE.MeshStandardMaterial({
      // 基础颜色贴图
      map: floorD,
      // 法线贴图
      normalMap: floorN,
      // 法线贴图的缩放因子, 用于调整法线贴图的强度
      normalScale: new THREE.Vector2(normalMapScale, normalMapScale),
      // 材质颜色
      color: meshColor,
      // 材质的深度信息不会影响深度缓冲区, 从而不会阻止其他物体渲染
      depthWrite: false,
      // 表面粗糙度
      roughness: roughness,
    });

    // 创建平面几何体, 用作地面的基础, 参数(平面宽度, 平面高度, 沿宽度方向的分割段数, 沿高度方向的分割段数)
    const g = new THREE.PlaneGeometry(
      size,
      size,
      widthSegments,
      heightSegments
    );
    g.rotateX(-Math.PI / 2);

    // Mesh将几何体g和材质mat结合, 形成可渲染的三维对象
    this.floor = new THREE.Mesh(g, mat);
    this.floor.receiveShadow = true;
    this.scene.add(this.floor);
  }

  animate() {
    // 获取自上次调用该方法以来的时间间隔(单位s)
    const delta = this.clock.getDelta();

    this.updateCharacter(delta);

    this.renderer.render(this.scene, this.camera);
  }

  updateCharacter(delta: number) {
    const { fadeDuration: fade, key, up, ease, rotate, position } = Controls;
    const { size } = Floor;
    // 获取当前水平旋转角度(弧度)
    const azimuth = this.orbitControls.getAzimuthalAngle();

    // 运动标记
    const active = key[0] === 0 && key[1] === 0 ? false : true;
    // 动画类型
    const play = active ? "Walk" : "Hiphop2";

    // 动画改变 过渡
    if (Controls.current != play) {
      const current = this.character.actions![play];
      const old = this.character.actions![Controls.current];
      Controls.current = play;

      this.setWeight(current, 1.0);
      old.fadeOut(fade);
      current.reset().fadeIn(fade).play();
    }

    // 移动
    if (Controls.current === "Walk") {
      // 速度
      const velocity = Controls.velocity;

      // 方向
      ease.set(key[1], 0, key[0]).multiplyScalar(velocity * delta);

      // 相机方向
      const angle = this.unwrapRad(Math.atan2(ease.x, ease.z) + azimuth);
      // 四元数rotate绕up旋转, 旋转角度是angle
      rotate.setFromAxisAngle(up, angle);

      // ease添加相机角度
      ease.applyAxisAngle(up, azimuth);

      // 将ease向量和position向量相加, 得到当前位置
      position.add(ease);

      const direction = new THREE.Vector3(0, 1, 0);
      this.raycaster.set(position, direction);

      this.checkCollision(ease, position, size);

      // 把position赋值给group.position
      this.group.position.copy(position);
      // 旋转, 使人物朝向行走方向
      this.group.quaternion.rotateTowards(rotate, Controls.rotateSpeed);

      this.orbitControls.target.copy(position).add({ x: 0, y: 1, z: 0 });
      this.followGroup.position.copy(position);

      // 保存旧位置
      this.oldPosition.copy(position);
    }

    if (this.character?.mixer) this.character?.mixer.update(delta);

    this.orbitControls.update();
  }

  // 碰撞检测
  checkCollision(ease: THREE.Vector3, position: THREE.Vector3, size: number) {
    const isIntersecting1 = this.raycaster.intersectObject(this.build.build1);
    // const that = this;

    // function up1() {
    //   if (isIntersecting1.length) {
    //     console.log(isIntersecting1);
    //     const { distance } = isIntersecting1[0];
    //     if (distance - position.y > 1) {
    //       return;  
    //     } else if (distance - position.y < 0.2) {
    //       // 上楼梯
    //       position.add(new THREE.Vector3(0, distance, 0));
    //     } else {
    //       position.copy(that.oldPosition);
    //     }
    //   } else {
    //   }
    // }

    if (this.checkBoundary(position, size, isIntersecting1)) {
      position.copy(this.oldPosition);
    } else {
      // up1();
      this.camera.position.add(ease);
    }
  }

  // 墙体判断
  checkBoundary(position: THREE.Vector3, size: number, ...isIntersectings: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[][]) {
    console.log(isIntersectings);
    if (
      isIntersectings.some((i) => i.length && i[0].distance < 0.13 + position.y) ||
      Math.abs(position["x"]) > size / 2 ||
      Math.abs(position["z"]) > size / 2
    ) {
      return true;
    } else {
      return false;
    }
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
    // 更新相机的投影矩阵
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }

  onKeyDown(e: KeyboardEvent) {
    const key = Controls.key;
    switch (e.code) {
      case "ArrowUp":
      case "KeyW":
        key[0] = -1;
        break;
      case "ArrowDown":
      case "KeyS":
        key[0] = 1;
        break;
      case "ArrowLeft":
      case "KeyA":
        key[1] = -1;
        break;
      case "ArrowRight":
      case "KeyD":
        key[1] = 1;
        break;
      case "KeyF":
        // 重置运动状态
        key[0] = 0;
        key[1] = 0;
        // 重置速度
        Controls.velocity = Controls.walkVelocity;
        window.open("https://www.baidu.com", "_blank");
        break;
    }
  }

  onKeyUp(e: KeyboardEvent) {
    const key = Controls.key;
    switch (e.code) {
      case "ArrowUp":
      case "KeyW":
        key[0] = key[0] < 0 ? 0 : key[0];
        break;
      case "ArrowDown":
      case "KeyS":
        key[0] = key[0] > 0 ? 0 : key[0];
        break;
      case "ArrowLeft":
      case "KeyA":
        key[1] = key[1] < 0 ? 0 : key[1];
        break;
      case "ArrowRight":
      case "KeyD":
        key[1] = key[1] > 0 ? 0 : key[1];
        break;
    }
  }

  onMouseDown(e: MouseEvent) {
    switch (e.button) {
      // 左键
      case 0:
        break;
      // 中键
      case 1:
        break;
      // 右键
      case 2:
        Controls.velocity = Controls.runVelocity;
        break;
    }
  }

  onMouseUp(e: MouseEvent) {
    switch (e.button) {
      // 左键
      case 0:
        break;
      // 中键
      case 1:
        break;
      // 右键
      case 2:
        Controls.velocity = Controls.walkVelocity;
        break;
    }
  }
}
