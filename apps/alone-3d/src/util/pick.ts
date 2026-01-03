import * as THREE from "three";
import BillBoards from "@/util/billBoards";

export default class Pick {
  // camera
  private camera: THREE.PerspectiveCamera;

  // canvas
  private canvas: HTMLCanvasElement;

  // objects 可选取对象列表
  private objects: THREE.Object3D[] = [];

  // raycaster
  private raycaster: THREE.Raycaster;

  // pickPosition 鼠标位置
  private pickPosition: THREE.Vector2;

  // pickedObjectName 选中的对象名称
  private pickedObjectName: string = "";

  constructor(
    camera: THREE.PerspectiveCamera,
    canvas: HTMLCanvasElement,
    group: THREE.Group
  ) {
    this.camera = camera;
    this.canvas = canvas;

    
    // billBoards
    const obj1 = new BillBoards(group, 200, 32, "hello world");
    this.objects.push(obj1.object);

    this.raycaster = new THREE.Raycaster();
    this.pickPosition = new THREE.Vector2(0, 0);

    window.addEventListener("mousemove", this.setPickPosition.bind(this));
    window.addEventListener("mouseout", this.clearPickPosition.bind(this));
    window.addEventListener("mouseleave", this.clearPickPosition.bind(this));
    document.addEventListener("mousedown", this.onMouseDown.bind(this));
    document.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  pick() {
    this.canvas.style.cursor = "auto";
    this.pickedObjectName = "";
    this.raycaster.setFromCamera(this.pickPosition, this.camera);
    const res = this.raycaster.intersectObjects(this.objects);
    if (res && res.length) {
      this.canvas.style.cursor = "pointer";
      this.pickedObjectName = res[0].object.name || res[0].object?.parent?.name || "";
    }
  }

  getCanvasRelativePosition(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) * this.canvas.width) / rect.width,
      y: ((event.clientY - rect.top) * this.canvas.height) / rect.height,
    };
  }

  setPickPosition(event: MouseEvent) {
    const pos = this.getCanvasRelativePosition(event);
    this.pickPosition.x = (pos.x / this.canvas.width) * 2 - 1;
    this.pickPosition.y = (pos.y / this.canvas.height) * -2 + 1;
    this.pick();
  }

  clearPickPosition() {
    this.pickPosition.x = -10000;
    this.pickPosition.y = -10000;
  }

  onMouseDown(e: MouseEvent) {
    switch (e.button) {
      // 左键
      case 0:
        switch (this.pickedObjectName) {
          case "hello world":
            window.open("https://www.baidu.com", "_self");
            break;
          default:
            break;
        }
        break;
      // 中键
      case 1:
        break;
      // 右键
      case 2:
        break;
    }
  }

  onMouseUp(e: MouseEvent) {
    switch (e.button) {
      // 左键
      case 0:
        break;
      // 中键
      case 1:
        break;
      // 右键
      case 2:
        break;
    }
  }
}
