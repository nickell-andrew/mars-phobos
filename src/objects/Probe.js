import THREE from 'three';
import Physics from '../ngraph-physics.js';
import CelestialBody from './CelestialBody';


class Probe extends CelestialBody {
  constructor() {

    var radius = 0.02;
    var texture = new THREE.ImageUtils.loadTexture('images/textures/moonmap2k.jpg');
    var bumpMap = new THREE.ImageUtils.loadTexture('images/textures/moonbump2k.jpg');
    var material = new THREE.MeshPhongMaterial({
      color: 0x444444, 
      map: texture,
      bumpMap: bumpMap,
      bumpScale: .000001,
      shininess: .000000000001
    });
    
    super(radius, material);
  }
  update() {
  }
}

export default Probe;