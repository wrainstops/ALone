import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ModelScale, ModelPosition } from '@/constant/application';

export default class Build extends GLTFLoader {
  build1!: THREE.Group;
  constructor(group: THREE.Group) {
    super();

    this.load("/build/dormitory/dormitory.gltf", (glb) => {
      const model = glb.scene;
      this.build1 = model;
      const { x: build_1_pos_x, y: build_1_pos_y, z: build_1_pos_z } = ModelPosition.build_1;
      model.position.set(build_1_pos_x, build_1_pos_y, build_1_pos_z);
      const { x: build_1_x, y: build_1_y, z: build_1_z } = ModelScale.build_1;
      model.scale.set(build_1_x, build_1_y, build_1_z);
      group.add(model);
    });
  }
}
