import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Capsule } from "three/addons/math/Capsule.js";
import { ModelScale } from "@/constant/application";

export default class Character extends GLTFLoader {
  // mixer
  mixer: THREE.AnimationMixer | undefined;

  // actions 行为动作列表
  actions: Record<string, THREE.AnimationAction> | undefined;

  // chCapsule 人物胶囊几何
  chCapsule: Capsule | undefined;

  constructor(group: THREE.Group) {
    super();

    this.load("/character/fly_girl.glb", (model) => {
      const ch = model.scene;
      ch.traverse(function (child) {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            // 启用深度写入 以修复透明穿模问题
            (mesh.material as THREE.MeshStandardMaterial).depthWrite = true;
          }
        }
      });
      const { x, y, z } = ModelScale.character;
      ch.scale.set(x, y, z);
      const chbox = new THREE.Box3().setFromObject(ch);
      const chsize = chbox.getSize(new THREE.Vector3());
      const chR = Math.sqrt(
        Math.pow(chsize.x / 2, 2) + Math.pow(chsize.z / 2, 2)
      ); // 人物半径
      const chH = chsize.y; // 人物高度
      const start = new THREE.Vector3(0, chR, 0);
      const end = new THREE.Vector3(0, chH - chR, 0);
      this.chCapsule = new Capsule(start, end, chR); // 人物胶囊几何
      group.add(ch);

      const animation = model.animations;

      // 动画混合器, 场景中有多个对象需要独立动画时, 可以为每个对象创建一个独立的动画混合器
      this.mixer = new THREE.AnimationMixer(ch);
      this.actions = {
        Walk: this.mixer.clipAction(animation[1]),
        Run: this.mixer.clipAction(animation[1]),
        Idle: this.mixer.clipAction(animation[1]),
      };

      for (const m in this.actions) {
        this.actions[m].enabled = true;
        // 动画时间比例, 默认1, 通俗的说就是倍速
        this.actions[m].setEffectiveTimeScale(1);
        // 动画权重值, 默认1. 如果要将一个动画动作完全占用, 则应将所有其他动画动作的有效权重置为0
        if (m !== "Idle") this.actions[m].setEffectiveWeight(0);
      }

      this.actions.Idle.play();
    });
  }
}
