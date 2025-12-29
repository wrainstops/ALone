import * as THREE from "three";

export default class BillBoards {
  constructor(
    group: THREE.Group,
    baseWidth: number,
    size: number,
    text: string
  ) {
    const ctx = document.createElement("canvas").getContext("2d")!;
    // ctx.font = `${ size }px bold`;
    const textWidth = ctx.measureText(text).width;
    console.log('textWidth', textWidth);

    const borderSize = 4;
    const width = baseWidth + borderSize;
    const height = size + borderSize;
    ctx.canvas.width = width;
    ctx.canvas.height = height;

    ctx.font = `${size}px bold`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    const scaleFactor = Math.min(1, baseWidth / textWidth);
    ctx.translate(width / 2, height / 2);
    ctx.scale(scaleFactor, 1);
    ctx.fillText(text, 0, 0);

    const canvas = ctx.canvas;
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    const labelMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
    });
    const label = new THREE.Sprite(labelMaterial);
    label.scale.x = canvas.width * 0.01;
    label.scale.y = canvas.height * 0.01;
    const root = new THREE.Object3D();
    root.position.set(2, 2, 2);
    root.add(label);

    group.add(root);
  }
}
