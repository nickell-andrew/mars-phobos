import THREE from 'three';
import Physics from '../ngraph-physics.js';
  
class CelestialBody extends THREE.Object3D {
  constructor(radius, material) {
    //THREE.Object3D.call(this);
    super();
    var geometry = new THREE.SphereGeometry(radius, 100, 100);
    this.mesh = new THREE.Mesh(geometry, material);
    this.add(this.mesh);
    this.particle = Physics.createParticle({x:0,y:0,z:0}, radius);
  }


/*Mars.prototype = new THREE.Object3D;
Mars.prototype.constructor = Mars; */

  update() {
    this.mesh.rotation.y += 0.01;
  }
}

export default CelestialBody;