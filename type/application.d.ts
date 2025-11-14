import * as THREE from "three";

export interface ApplicationOptions {
  canvas: HTMLCanvasElement;
}

// 透视摄像机 PerspectiveCamera
export interface PerspectiveCameraParameterT {
  fov?: number; // field of view 视野范围
  aspect?: number; // 宽高比
  near?: number; // 近平面，小于这个范围的物体将被裁剪
  far?: number; // 远平面，大于这个范围的物体将被裁剪
}

// 偏移量 PositionT
export interface PositionT {
  x: number; // +右移
  y: number; // +上移
  z: number; // +后移
}

// 颜色 ColorT
export type ColorT = THREE.ColorRepresentation;

// 雾 FogT
export interface FogT {
  color: ColorT;
  near: number;
  far: number;
}

// 方向光
export interface DirectionalLightT {
  color: ColorT;
  intensity: number;
  shadowMapSizeX: number; // 阴影贴图大小(分辨率) - 宽度 - 越大越清晰; 但会影响性能
  shadowMapSizeY: number; // 阴影贴图大小(分辨率) - 高度 - 越打越清晰; 但会影响性能
}
