import Physics from './ngraph-physics.js';
window.lion.Physics = Physics;

import THREE from 'three';

import Mars from './objects/Mars';
import Moon from './objects/Moon';
import Probe from './objects/Probe';


function Scene (width, height){
  // Basic three.js setup
  this.scene = new THREE.Scene();
    
  this.camera = new THREE.PerspectiveCamera(80, width / height, 0.1, 10);
  this.setCameraPosition({x:0, y:0, z:2});    


  this.renderer = new THREE.WebGLRenderer();
  this.renderer.setSize(width, height);
  this.renderer.setClearColor(0x000000);

  this.bodies = [];  //Our array of CelestialBodies
  this.probes = []; //Our array of Probes
  
  // Directly add objects
  this.planet = new Mars();
  this.planet.setPosition({x:0, y:0, z:0});
  this.scene.add(this.planet);
  this.bodies.push(this.planet); //adding this.planet to this.bodies
    
  var sphere = new THREE.SphereGeometry( 0.5, 16, 8 );
  var light1 = new THREE.PointLight( 0xffffff, 7, 8, 2 );
  light1.add( new THREE.Mesh( Moon , new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
  light1.position.z = this.camera.position.z;
  light1.position.x = this.camera.position.x;
  light1.position.y = this.camera.position.y;
  this.scene.add( light1 );
    
  // Or create container classes for them to simplify your code
  this.moon = new Moon();
  this.moon.setPosition({x:1, y:0, z:0});
  this.scene.add(this.moon);
  this.bodies.push(this.moon); //adding this.moon to this.bodies
      
  this.setPlanetFrequenciesFromDOM();  
  console.log('Scene runnning...');
}
 
Scene.prototype.setCameraPosition = function(pos) {
  this.camera.position.set(pos.x, pos.y, pos.z);
}

Scene.prototype.resize = function(width, height) {
  this.camera.aspect = width / height;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(width, height);
}

Scene.prototype.runPhysicsOnBodies = function (milliseconds) { 
  Physics.tick( this.bodies.map( 
    (body) => body.particle 
  ));
}

Scene.prototype.updatePositionsFromParticles = function () {
  this.bodies.forEach( (body) => body.updatePositionFromParticle() );
}

Scene.prototype.setPlanetFrequenciesFromDOM = function () {
  this.planet.fundamentalFrequency = Number(
    $('#planet-fundamental').val()
  );
    
  this.planet.xHarmonic = Number(
    $('#planet-x-harmonic').val()
  );
    
  this.planet.yHarmonic = Number(
    $('#planet-y-harmonic').val()
  );
  
}

Scene.prototype.launchProbe = function (fromSurfaceOf, velocity) {
  var probe = new Probe();
  probe.position.set(0, 1, 0);
  this.bodies.push(probe);
  return probe;
}

Scene.prototype.render = function (milliseconds) {    
  this.runPhysicsOnBodies(milliseconds);
  
  this.updatePositionsFromParticles();
  
  this.camera.lookAt(this.planet.position);
  
  this.renderer.render(this.scene, this.camera);
  
  this.planet.rotation.y += 0.01;
  this.planet.rotation.x += 0.01;

  this.moon.update();
  
  
}


export default Scene;