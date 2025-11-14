import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default class Build extends GLTFLoader {
  build1!: THREE.Group;
  constructor(group: THREE.Group) {
    super();

    this.load("/build/build1/build1.gltf", (glb) => {
      const model = glb.scene;
      this.build1 = model;
      model.position.set(3, 0, 3);
      group.add(model);
    });
  }
}
