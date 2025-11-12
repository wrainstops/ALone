import * as THREE from "three";
import type {
  PerspectiveCameraParameterT,
  PositionT,
  ColorT,
  DirectionalLightT,
  FogT,
} from "#/application";

// 摄像机参数
export const PerspectiveCamera: PerspectiveCameraParameterT = {
  fov: 45,
  aspect: window.innerWidth / window.innerHeight,
  near: 0.1,
  far: 100,
};

// 摄像机位置
export const PerspectiveCameraPosition: PositionT = {
  x: 0,
  y: 2,
  z: -5,
};

// scene背景色
export const SceneBackgroundColor: ColorT = 0xffffff;

// fog参数
export const Fog: FogT = {
  color: 0x88ccee,
  near: 0,
  far: 50,
};

// 方向光参数
export const DirectionalLight: DirectionalLightT = {
  color: 0xffffff,
  intensity: 5,
  shadowMapSizeX: 1024,
  shadowMapSizeY: 1024,
};

// 方向光位置
export const DirectionalLightPosition: PositionT = {
  x: -2,
  y: 5,
  z: -3,
};

export const settings = {
  show_skeleton: false,
  fixe_transition: true,
};

export const controls = {
  key: [0, 0],
  ease: new THREE.Vector3(),
  position: new THREE.Vector3(),
  up: new THREE.Vector3(0, 1, 0),
  rotate: new THREE.Quaternion(),
  current: "Idle",
  fadeDuration: 0.5,
  runVelocity: 5,
  walkVelocity: 1.8,
  rotateSpeed: 0.05,
  floorDecale: 0,
};
