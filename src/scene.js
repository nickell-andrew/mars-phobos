import Physics from './ngraph-physics.js';
window.dbg.Physics = Physics;

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
  
  // Directly add objects
  this.planet = new Mars();
  this.planet.setPosition({x:0, y:0, z:0});
  this.planet.pinnedInPlace = true; // we don't want mars moving on us...
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
  this.bodies.forEach(
    (body) => body.updatePositionFromParticle() 
  );
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
  console.log("Probe Away! ...moving at ", velocity);
  
  var launchPos = fromSurfaceOf.getPosition();
  launchPos.y += fromSurfaceOf.radius * 8; //FIXME I should be sane distance
  
  var probe = new Probe();
  probe.setPosition(launchPos);
  this.bodies.push(probe);

  probe.setVelocity(-velocity, 0, 0);
  
  this.scene.add(probe);

  return probe;
}

Scene.prototype.detectParticleCollisions = function (resolveCollisionCB) {
  for (var i = 0; i < this.bodies.length; i++) {
    var p1 = this.bodies[i];
    for (var j = i+1; j < this.bodies.length; j++) {
      var p2 = this.bodies[j];
      if (p1.distanceToSurfaceOf(p2) <= 0) {
        
        var larger = p1.radius > p2.radius ? p1 : p2;
        var smaller = p1 === larger ? p2 : p1;
        
        resolveCollisionCB(larger, smaller);
      }
    }
  }
}

Scene.prototype.deleteBody = function (body) {
  var bodyIndex = this.bodies.indexOf(body);
  if (bodyIndex >= 0) {
    this.scene.remove(body);
    this.bodies.splice(bodyIndex, 1);
  }
}

Scene.prototype.render = function (milliseconds) {    
  this.runPhysicsOnBodies(milliseconds);
  
  // Reset the particle positions of pinned bodies so they no move
  this.bodies
    .filter( b => b.pinnedInPlace )
    .forEach( b => b.updateParticleFromPosition() );
  
  this.updatePositionsFromParticles();
  
  this.detectParticleCollisions(function (larger, smaller) {
    this.deleteBody(smaller);
    alert("Game Over!");
  }.bind(this));   
   
  this.renderer.render(this.scene, this.camera);
  
  this.bodies.forEach(
    b => b.update()
  )
}


export default Scene;