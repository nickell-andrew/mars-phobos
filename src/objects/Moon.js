import THREE from 'three';
import Physics from '../ngraph-physics.js';


class Moon extends THREE.Object3D {
  constructor() {
    super();
    var radius = 0.02;
    var texture = new THREE.ImageUtils.loadTexture('images/textures/moonmap2k.jpg');
    var bumpMap = new THREE.ImageUtils.loadTexture('images/textures/moonbump2k.jpg');
    var geometry = new THREE.SphereGeometry(radius, 100, 100);
    var material = new THREE.MeshPhongMaterial({
      color: 0x444444, 
      map: texture,
      bumpMap: bumpMap,
      bumpScale: .000001,
      shininess: .000000000001
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.add(this.mesh);
    this.particle = Physics.createParticle({x:0,y:0,z:0}, radius);
    this.particle.body.velocity.y = 1.0;
  }
  update() {
    this.mesh.rotation.y += .0003 ;
  }
}

export default Moon;