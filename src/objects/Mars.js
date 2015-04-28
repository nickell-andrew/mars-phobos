import THREE from 'three';
import Physics from '../ngraph-physics.js';
  
class Mars extends THREE.Object3D {
  constructor() {
    //THREE.Object3D.call(this);
    super();
    var radius = 0.08;
    var texture = new THREE.ImageUtils.loadTexture('images/textures/marsmap2k.jpg');
    var bumpMap = new THREE.ImageUtils.loadTexture('images/textures/marsbump2k.jpg');
    var geometry = new THREE.SphereGeometry(radius, 100, 100);
    var material = new THREE.MeshPhongMaterial({
      color: 0x552222, 
      map: texture,
      bumpMap: bumpMap,
      bumpScale: .02,
      shininess: .000000001
    });
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

export default Mars;