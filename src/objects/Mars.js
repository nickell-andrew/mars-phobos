import THREE from 'three';
import Physics from '../ngraph-physics.js';
import CelestialBody from './CelestialBody'
  
class Mars extends CelestialBody {
  constructor() {
    //THREE.Object3D.call(this);
    
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


/*Mars.prototype = new THREE.Object3D;
Mars.prototype.constructor = Mars; */

  update() {
    this.mesh.rotation.y = 0.00;
  }
}

export default Mars;