// https://github.com/anvaka/ngraph.physics.simulator

import createSimulator from 'ngraph.physics.simulator';

var sim = createSimulator({
  gravity: 1.0,
  timeStep: .01,
  dragCoeff: 0.0  
});

window.phys = {
  createSimulator: createSimulator,
  simulator: sim,
  runAStep: function () {
    var i=0;
    console.log("\n\n\nBefore tick: ");
    for (i=0; i < sim.bodies.length; i++) {
      var body = sim.bodies[i].pos;
      console.log("\tBODY: x:", body.x, " y:", body.y, " z:", body.z);
    }

    sim.step();

    console.log("After tick: ");
    for (i=0; i < sim.bodies.length; i++) {
      var body = sim.bodies[i].pos;
      console.log("\tBODY: x:", body.x, " y:", body.y, " z:", body.z);
    }

  }
}

var Particle = function (pos, mass, simulator) {
  this.body = simulator.addBodyAt(pos);
  this.body.mass = mass;  
};

Particle.prototype.getPosition = function () {
  return this.body.pos;
}

Particle.prototype.setPosition = function (pos) {
  this.body.pos.x = pos.x;
  this.body.pos.y = pos.y;
  this.body.pos.z = pos.z;
}

var PLANET_DENSITY = 400.0;

export default {
  createParticle: function (pos, radius) {
    var volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
    var mass = volume * PLANET_DENSITY;
    console.log(mass);
    return new Particle(pos, mass, sim);
  },
  tick: function (particles) {
    sim.step();
  }
}