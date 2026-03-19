import * as THREE from 'three'
import type { PerspectiveCameraParameterT, PositionT, DirectionalLightT, FogT } from '#/application'

// 摄像机参数
export const PerspectiveCamera: PerspectiveCameraParameterT = {
  fov: 40,
  aspect: window.innerWidth / window.innerHeight,
  near: 0.1,
  far: 300,
}

// 摄像机位置
export const PerspectiveCameraPosition: PositionT = {
  x: 0,
  y: 3,
  z: -10,
}

// fog参数
export const Fog: FogT = {
  color: 0x808080,
  near: 0,
  far: 500,
}

// 方向光参数
export const DirectionalLight: DirectionalLightT = {
  color: 0xffffff,
  intensity: 5,
  shadowMapSizeX: 1024,
  shadowMapSizeY: 1024,
}

// 方向光位置
export const DirectionalLightPosition: PositionT = {
  x: -2,
  y: 5,
  z: -3,
}

// 人物控制器配置
export const Controls = {
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
  current: 'Idle',
  // 动画渐变的时间
  fadeDuration: 0.5,
  // 运动速度
  velocity: 5,
  // run速度
  runVelocity: 20,
  // walk速度
  walkVelocity: 5,
  // 人物朝向旋转速度
  rotateSpeed: 0.05,
}

// floor参数
export const Floor = {
  // 地面边长
  size: 1000,
  // 一片floor重复次数
  repeat: 16,
  // 法线贴图的缩放因子
  normalMapScale: 0.5,
  // 材质颜色
  meshColor: 0x404040,
  // 表面粗糙度
  roughness: 0.85,
  // 沿宽度方向的分割段数
  widthSegments: 50,
  // 沿高度方向的分割段数
  heightSegments: 50,
}

// 模型缩放比例
export const ModelScale: Record<string, PositionT> = {
  // 人物
  character: {
    x: 0.9,
    y: 0.9,
    z: 0.9,
  },
  // 建筑1
  build_1: {
    x: 50,
    y: 50,
    z: 50,
  },
}

// 模型位置
export const ModelPosition: Record<string, PositionT> = {
  // 建筑1
  build_1: {
    x: 0,
    y: -10,
    z: 0,
  },
}

// 开关配置
export const GlobalSwitch: Record<string, boolean> = {
  // octreeHelper
  openOctreeHelper: false,
}
