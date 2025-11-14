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
  fov: 90,
  aspect: window.innerWidth / window.innerHeight,
  near: 0.1,
  far: 100,
};

// 摄像机位置
export const PerspectiveCameraPosition: PositionT = {
  x: 0,
  y: 5,
  z: -5,
};

// fog参数
export const Fog: FogT = {
  color: 0x808080,
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

// 人物控制器配置
export const controls = {
  // 向量, 运动方向和运动速度
  ease: new THREE.Vector3(),
  // 向量, 人物位置
  position: new THREE.Vector3(),
  // 固定向量, 相当于xz面的法向量, 用于旋转人物朝向
  up: new THREE.Vector3(0, 1, 0),
  // 四元数
  rotate: new THREE.Quaternion(),
  // 行动方向[+后退 -前进, +右转 -左转]
  key: [0, 0],
  // 当前动作
  current: "Hiphop2",
  // 动画渐变的时间
  fadeDuration: 0.5,
  // 运动速度
  velocity: 1.8,
  // run速度
  runVelocity: 5,
  // walk速度
  walkVelocity: 1.8,
  // 人物朝向旋转速度
  rotateSpeed: 0.05,
};
