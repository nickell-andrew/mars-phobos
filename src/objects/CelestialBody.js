import THREE from 'three';
import Physics from '../ngraph-physics.js';
  
class CelestialBody extends THREE.Object3D {
  constructor(radius, material) {
    super();
    this.radius = radius;
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
  setPosition(pos) {
    this.position.set(pos.x, pos.y, pos.z);
    this.particle.setPosition(pos);
  }
  getPosition() {
    return {
      x: this.position.x, 
      y: this.position.y, 
      z: this.position.z
    };
  }
  setVelocity(x, y, z) {
    this.particle.body.velocity.x = x;
    this.particle.body.velocity.y = y;
    this.particle.body.velocity.z = z;
  }
  updatePositionFromParticle() {
    this.setPosition( this.particle.getPosition() );
  }
}

export default CelestialBody;