import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default class Character extends GLTFLoader {
  // mixer
  mixer: THREE.AnimationMixer | undefined;

  // actions
  actions: Record<string, THREE.AnimationAction> | undefined;

  constructor(group: THREE.Group) {
    super();

    this.load("/walk/character.glb", (glb) => {
      const model = glb.scene;
      group.add(model);

      const animation = glb.animations;

      // 动画混合器, 场景中有多个对象需要独立动画时, 可以为每个对象创建一个独立的动画混合器
      this.mixer = new THREE.AnimationMixer(model);
      this.actions = {
        Walk: this.mixer.clipAction(animation[0]),
        Run: this.mixer.clipAction(animation[1]),
        Rap: this.mixer.clipAction(animation[3]),
        Hiphop: this.mixer.clipAction(animation[4]),
        Fight: this.mixer.clipAction(animation[7]),
        Talking: this.mixer.clipAction(animation[8]),
        Hiphop2: this.mixer.clipAction(animation[9]),
      };

      for (const m in this.actions) {
        this.actions[m].enabled = true;
        // 动画时间比例, 默认1, 通俗的说就是倍速
        this.actions[m].setEffectiveTimeScale(1);
        // 动画权重值, 默认1. 如果要将一个动画动作完全占用, 则应将所有其他动画动作的有效权重置为0
        if (m !== "Hiphop2") this.actions[m].setEffectiveWeight(0);
      }

      this.actions.Hiphop2.play();
    });
  }
}
