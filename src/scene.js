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
Scene.prototype.youClickedMe = function () {
  console.log('You clicked me');
}


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

Scene.prototype.updateParticlePositionsPhysics = function (milliseconds) {
  Physics.tick([this.planet.particle, this.moon.particle]);

}

Scene.prototype.updatePositionsFromParticles = function () {
  this.setMoonPosition( this.moon.particle.getPosition() );
  this.setPlanetPosition( this.planet.particle.getPosition() );
}

Scene.prototype.updateParticlePositionsNoPhysics = function (milliseconds) {
  
  var percentThroughCurrentCycle = function(milliseconds, periodLengthMS) {
    return (milliseconds % periodLengthMS)  / periodLengthMS;
  }
  var periodRadians = 2 * Math.PI;
  
  var moonX = Math.cos(
    percentThroughCurrentCycle(milliseconds, 5000) * periodRadians
  );
  var moonY = 0.5 * Math.sin(
    percentThroughCurrentCycle(milliseconds, 5000) * periodRadians
  );
  var moonPos = {x:moonX , y: moonY, z: 0 };
  this.moon.particle.setPosition(moonPos);
  
  if (!this.planet.fundamentalFrequency 
      || !this.planet.xHarmonic 
      || !this.planet.yHarmonic) {
    this.setPlanetFrequenciesFromDOM();
  }
  
  var periodPlanetX = (1/ (this.planet.fundamentalFrequency
    * this.planet.xHarmonic)) * 1000;
  var planetX = 0.5 * Math.sin(
    percentThroughCurrentCycle(milliseconds, periodPlanetX) * periodRadians
  );
  
  var periodPlanetY = (1/ (this.planet.fundamentalFrequency
    * this.planet.yHarmonic)) * 1000;
  var planetY = 0.25 * Math.sin(
    percentThroughCurrentCycle(milliseconds, periodPlanetY) * periodRadians
  ); 
  
  var planetPos = {x: planetX , y: planetY, z: 0};
  this.planet.particle.setPosition(planetPos);
}

Scene.prototype.setPlanetFrequenciesFromDOM = function () {
  this.planet.fundamentalFrequency = Number(
    $('#planet-fundamental').val()
  );
  console.log("Planet's fundamental frequency is: " 
    + this.planet.fundamentalFrequency);
    
  this.planet.xHarmonic = Number(
    $('#planet-x-harmonic').val()
  );
  console.log("Planet's 'X' harmonic is: " 
    + this.planet.xHarmonic);
  
  
  this.planet.yHarmonic = Number(
    $('#planet-y-harmonic').val()
  );
  console.log("Planet's 'Y' harmonic is: " 
    + this.planet.yHarmonic);
  
}

Scene.prototype.render = function (milliseconds) {    
  // this.updateParticlePositionsUsingPhysics(milliseconds);
  this.updateParticlePositionsNoPhysics(milliseconds);
  this.updatePositionsFromParticles();
  
  this.renderer.render(this.scene, this.camera);
  
  this.planet.rotation.y += 0.01;
  this.planet.rotation.x += 0.01;

  this.moon.update();
  
  
}


export default Scene;