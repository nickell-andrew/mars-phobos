import THREE from 'three';
import Physics from '../ngraph-physics.js';
import CelestialBody from './CelestialBody';


class Moon extends CelestialBody {
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
    this.particle.body.velocity.y = 0.015;
  }
  update() {
    this.rotation.y += .0003 ;
  }
}

export default Moon;