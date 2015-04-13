import Physics from './physics.js';
window.lion.Physics = Physics;
import Mars from './objects/Mars.js';
import Moon from './objects/Moon.js';
import THREE from 'three';

function Scene (width, height){
  // Basic three.js setup
  this.scene = new THREE.Scene();
    
  this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10);
  this.camera.position.z = 500;

  this.renderer = new THREE.WebGLRenderer();
  this.renderer.setSize(width, height);
  this.renderer.setClearColor(0x000000);

  // Directly add objects
  this.planet = new Mars();
  this.planet.position.set(-150, 0, 0);
  this.scene.add(this.planet);
    
  var sphere = new THREE.SphereGeometry( 0.5, 16, 8 );
  var light1 = new THREE.PointLight( 0xffffff, 7, 500, 2 );
  light1.add( new THREE.Mesh( Moon , new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
  light1.position.z = this.camera.position.z/2;
  light1.position.x = this.camera.position.x;
  light1.position.y = this.camera.position.y;
  this.scene.add( light1 );
    


  // Or create container classes for them to simplify your code
  this.moon = new Moon();
  this.moon.position.set(150, 0, 0);
  this.scene.add(this.moon);
    
  this.setPlanetPosition({x:0, y:0, z:0});
  this.setMoonPosition({x:1, y:0, z:0});
  this.setCameraPosition({x:0, y:0, z:2});    
    
  console.log('Scene runnning...');
}

// New Methods

Scene.prototype.setMoonPosition = function(pos) {
  this.moon.position.set(pos.x, pos.y, pos.z);
  this.moon.particle.setPosition(pos);
} 
Scene.prototype.setPlanetPosition = function(pos) {
  this.planet.position.set(pos.x, pos.y, pos.z);
  this.planet.particle.setPosition(pos);
} 
Scene.prototype.setCameraPosition = function(pos) {
  this.camera.position.set(pos.x, pos.y, pos.z);
}

Scene.prototype.resize = function(width, height) {
  this.camera.aspect = width / height;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(width, height);
}

Scene.prototype.updateParticlePositionsUsingPhysics = function (milliseconds) {
  Physics.tick([this.planet.particle, this.moon.particle]);

}

Scene.prototype.updatePositionsFromParticles = function () {
  this.setMoonPosition( this.moon.particle.getPosition() );
  this.setPlanetPosition( this.planet.particle.getPosition() );
}

Scene.prototype.updateParticlePositionsNoPhysics = function (milliseconds) {
  
  var percentThroughCurrentCycleMoon = function() {
    return (milliseconds % 1000) / 1000;
  }
  
  var percentThroughCurrentCyclePlanet = function() {
    return ((milliseconds % 3000) / 3000);
  }
  
  var moonY = Math.sin(percentThroughCurrentCycleMoon() * 2 * Math.PI);
  var moonPos = {x:1 , y: moonY*.5, z: 0 };
  this.moon.particle.setPosition(moonPos);
  
  var planetX = Math.sin(percentThroughCurrentCyclePlanet() * 2 * Math.PI);
  var planetPos = {x: planetX*.5 , y: 0, z: 0};
  this.planet.particle.setPosition(planetPos);
}

Scene.prototype.render = function(milliseconds) {    
  // this.updateParticlePositionsUsingPhysics(milliseconds);
  this.updateParticlePositionsNoPhysics(milliseconds);
  this.updatePositionsFromParticles();
  
  this.renderer.render(this.scene, this.camera);
  
  this.planet.rotation.y += 0.01;
  this.planet.rotation.x += 0.01;

  this.moon.update();
  
  
}


export default Scene;