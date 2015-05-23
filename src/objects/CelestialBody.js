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
    this.pinnedInPlace = false;
  }

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
  distanceToCenterOf(other) {
    return Math.sqrt(
      Math.pow(this.position.x - other.position.x, 2) 
      + Math.pow(this.position.y - other.position.y, 2)
      + Math.pow(this.position.z - other.position.z, 2)
    );
  }
  distanceToSurfaceOf(other) {
    return this.distanceToCenterOf(other) - this.radius - other.radius;
  }
  setVelocity(x, y, z) {
    this.particle.body.velocity.x = x;
    this.particle.body.velocity.y = y;
    this.particle.body.velocity.z = z;
  }
  updatePositionFromParticle() {
    this.setPosition( this.particle.getPosition() );
  }
  updateParticleFromPosition() {
    this.particle.setPosition(
      this.getPosition()
    );
  }
}

export default CelestialBody;