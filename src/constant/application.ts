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
  z: -3
}
