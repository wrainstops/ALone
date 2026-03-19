import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Octree } from 'three/addons/math/Octree.js'
import { OctreeHelper } from 'three/addons/helpers/OctreeHelper.js'
import { ModelScale, ModelPosition, GlobalSwitch } from '@/constant/application'

export default class Build extends GLTFLoader {
  // build1 建筑1
  build1!: THREE.Group

  constructor(group: THREE.Group, octree: Octree) {
    super()

    this.load('/build/scene_huangcheng/scene_huangcheng.gltf', (model) => {
      const b = model.scene
      b.traverse(function (child) {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          if (mesh.material) {
            ;(mesh.material as THREE.MeshStandardMaterial).emissive = (
              mesh.material as THREE.MeshStandardMaterial
            ).color
            ;(mesh.material as THREE.MeshStandardMaterial).emissiveMap = (
              mesh.material as THREE.MeshStandardMaterial
            ).map
          }
        }
      })
      this.build1 = b
      const { x: build_1_pos_x, y: build_1_pos_y, z: build_1_pos_z } = ModelPosition.build_1
      b.position.set(build_1_pos_x, build_1_pos_y, build_1_pos_z)
      const { x: build_1_x, y: build_1_y, z: build_1_z } = ModelScale.build_1
      b.scale.set(build_1_x, build_1_y, build_1_z)
      group.add(b)
      octree.fromGraphNode(b)

      if (GlobalSwitch.openOctreeHelper) {
        const octreeHelper = new OctreeHelper(octree)
        group.add(octreeHelper)
      }
    })
  }
}
