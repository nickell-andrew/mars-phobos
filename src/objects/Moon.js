import THREE from 'three';
import Physics from '../physics.js';


function Moon(){
  THREE.Object3D.call(this);
  var radius = 0.05;
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
}

Moon.prototype = new THREE.Object3D;
Moon.prototype.constructor = Moon;
   
Moon.prototype.update = function() {
  this.mesh.rotation.y += .0003 ;
};

export default Moon;