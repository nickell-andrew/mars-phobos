import THREE from 'three';
import Physics from '../ngraph-physics.js';
import CelestialBody from './CelestialBody'
  
class Mars extends CelestialBody {
  constructor() {
    var radius = 0.08;
    var texture = new THREE.ImageUtils.loadTexture('images/textures/marsmap2k.jpg');
    var bumpMap = new THREE.ImageUtils.loadTexture('images/textures/marsbump2k.jpg');
    var material = new THREE.MeshPhongMaterial({
      color: 0x552222, 
      map: texture,
      bumpMap: bumpMap,
      bumpScale: .02,
      shininess: .000000001
    });
    
    super(radius, material);
  }

  update() {
    this.rotation.y += 0.01;
    this.rotation.x += 0.01;
  }
}

export default Mars;