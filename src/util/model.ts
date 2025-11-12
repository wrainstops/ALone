import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { settings } from "@/constant/application";

export default class LoadModel extends GLTFLoader {
  // skeleton
  skeleton: THREE.SkeletonHelper | undefined;

  // mixer
  mixer: THREE.AnimationMixer | undefined;

  // actions
  actions: Record<string, THREE.AnimationAction> | undefined;

  constructor(group: THREE.Group, scene: THREE.Scene) {
    super();

    this.load("/walk/Soldier.glb", (glb) => {
      const model = glb.scene;
      group.add(model);
      model.rotation.y = Math.PI;
      group.rotation.y = Math.PI;

      model.traverse((obj: any) => {
        if ((obj as THREE.Mesh).isMesh) {
          if (obj.name === "vanguard_Mesh") {
            obj.castShadow = true;
            obj.receiveShadow = true;
            obj.material.metalness = 1;
            obj.material.roughness = 0.2;
            obj.material.color.set(1, 1, 1);
            obj.material.metalnessMap = obj.material.map;
          } else {
            obj.material.metalness = 1;
            obj.material.roughness = 0;
            obj.material.transparent = true;
            obj.material.opacity = 0.8;
            obj.material.color.set(1, 1, 1);
          }
        }
      });

      this.skeleton = new THREE.SkeletonHelper(model);
      this.skeleton.setColors(
        new THREE.Color(0xe000ff),
        new THREE.Color(0x00e0ff)
      );
      this.skeleton.visible = false;
      scene.add(this.skeleton);

      this.createPanel();

      const animation = glb.animations;

      this.mixer = new THREE.AnimationMixer(model);
      this.actions = {
        Idle: this.mixer.clipAction(animation[0]),
        Walk: this.mixer.clipAction(animation[3]),
        Run: this.mixer.clipAction(animation[1]),
      };

      for (const m in this.actions) {
        this.actions[m].enabled = true;
        this.actions[m].setEffectiveTimeScale(1);
        if (m !== "Idle") this.actions[m].setEffectiveWeight(0);
      }

      this.actions.Idle.play();
    });
  }

  createPanel() {
    const panel = new GUI({ width: 310 });
    panel.add(settings, "show_skeleton").onChange((b) => {
      this.skeleton!.visible = b;
    });
    panel.add(settings, "fixe_transition");
  }
}
