import './style.css'
import Application from './util/application'

interface MyWindow extends Window {
  application?: Application
}

;(window as MyWindow).application = new Application({
  canvas: document.getElementById('my-canvas') as HTMLCanvasElement,
})
