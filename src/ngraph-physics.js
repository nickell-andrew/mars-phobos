// https://github.com/anvaka/ngraph.physics.simulator

import createSimulator from 'ngraph.physics.simulator';
import quadtree from 'ngraph.quadtreebh3d';
import ngraphrandom from 'ngraph.random';
import merge from 'ngraph.merge';
import expose from 'ngraph.expose';
import physics from 'ngraph.physics.primitives';

var sim = createSimulator({
  gravity: 1.0,
  timeStep: .25,
  dragCoeff: 0.0,
  createBody: function(pos) {
    return new physics.Body3d(pos);
  },
  integrator: function (bodies, timeStep) {
    var dx = 0, tx = 0,
        dy = 0, ty = 0,
        dz = 0, tz = 0,
        i,
        max = bodies.length;

    for (i = 0; i < max; ++i) {
      var body = bodies[i],
          coeff = timeStep / body.mass;

      body.velocity.x += coeff * body.force.x;
      body.velocity.y += coeff * body.force.y;
      body.velocity.z += coeff * body.force.z;

      var vx = body.velocity.x,
          vy = body.velocity.y,
          vz = body.velocity.z,
          v = Math.sqrt(vx * vx + vy * vy + vz * vz);

      if (v > 1) {
        body.velocity.x = vx / v;
        body.velocity.y = vy / v;
        body.velocity.z = vz / v;
      }

      dx = timeStep * body.velocity.x;
      dy = timeStep * body.velocity.y;
      dz = timeStep * body.velocity.z;

      body.pos.x += dx;
      body.pos.y += dy;
      body.pos.z += dz;

      tx += Math.abs(dx); ty += Math.abs(dy); tz += Math.abs(dz);
    }

    return (tx * tx + ty * ty + tz * tz)/bodies.length;
  },
  createSpringForce: function (options) {
    var random = ngraphrandom;
    options = merge(options, {
      springCoeff: 0.0002,
      springLength: 80
    });

    var api = {
      /**
       * Upsates forces acting on a spring
       */
      update : function (spring) {
        var body1 = spring.from,
            body2 = spring.to,
            length = spring.length < 0 ? options.springLength : spring.length,
            dx = body2.pos.x - body1.pos.x,
            dy = body2.pos.y - body1.pos.y,
            dz = body2.pos.z - body1.pos.z,
            r = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (r === 0) {
            dx = (random.nextDouble() - 0.5) / 50;
            dy = (random.nextDouble() - 0.5) / 50;
            dz = (random.nextDouble() - 0.5) / 50;
            r = Math.sqrt(dx * dx + dy * dy + dz * dz);
        }

        var d = r - length;
        var coeff = ((!spring.coeff || spring.coeff < 0) ? options.springCoeff : spring.coeff) * d / r * spring.weight;

        body1.force.x += coeff * dx;
        body1.force.y += coeff * dy;
        body1.force.z += coeff * dz;

        body2.force.x -= coeff * dx;
        body2.force.y -= coeff * dy;
        body2.force.z -= coeff * dz;
      }
    };

    expose(options, api, ['springCoeff', 'springLength']);
    return api;
  },
  createDragForce: function (options) {
    options = merge(options, {
      dragCoeff: 0.02
    });

    var api = {
      update : function (body) {
        body.force.x -= options.dragCoeff * body.velocity.x;
        body.force.y -= options.dragCoeff * body.velocity.y;
        body.force.z -= options.dragCoeff * body.velocity.z;
      }
    };

    // let easy access to dragCoeff:
    expose(options, api, ['dragCoeff']);

    return api;
  },
  createBounds: function (bodies, settings) {
    var random = ngraphrandom.random(42);
    var boundingBox =  { x1: 0, y1: 0, z1: 0, x2: 0, y2: 0, z2: 0 };

    return {
      box: boundingBox,

      update: updateBoundingBox,

      reset : function () {
        boundingBox.x1 = boundingBox.y1 = 0;
        boundingBox.x2 = boundingBox.y2 = 0;
        boundingBox.z1 = boundingBox.z2 = 0;
      },

      getBestNewPosition: function (neighbors) {
        var graphRect = boundingBox;

        var baseX = 0, baseY = 0, baseZ = 0;

        if (neighbors.length) {
          for (var i = 0; i < neighbors.length; ++i) {
            baseX += neighbors[i].pos.x;
            baseY += neighbors[i].pos.y;
            baseZ += neighbors[i].pos.z;
          }

          baseX /= neighbors.length;
          baseY /= neighbors.length;
          baseZ /= neighbors.length;
        } else {
          baseX = (graphRect.x1 + graphRect.x2) / 2;
          baseY = (graphRect.y1 + graphRect.y2) / 2;
          baseZ = (graphRect.z1 + graphRect.z2) / 2;
        }

        var springLength = settings.springLength;
        return {
          x: baseX + random.next(springLength) - springLength / 2,
          y: baseY + random.next(springLength) - springLength / 2,
          z: baseZ + random.next(springLength) - springLength / 2
        };
      }
    };

    function updateBoundingBox() {
      var i = bodies.length;
      if (i === 0) { return; } // don't have to wory here.

      var x1 = Number.MAX_VALUE,
          y1 = Number.MAX_VALUE,
          z1 = Number.MAX_VALUE,
          x2 = Number.MIN_VALUE,
          y2 = Number.MIN_VALUE,
          z2 = Number.MIN_VALUE;

      while(i--) {
        // this is O(n), could it be done faster with quadtree?
        // how about pinned nodes?
        var body = bodies[i];
        if (body.isPinned) {
          body.pos.x = body.prevPos.x;
          body.pos.y = body.prevPos.y;
          body.pos.z = body.prevPos.z;
        } else {
          body.prevPos.x = body.pos.x;
          body.prevPos.y = body.pos.y;
          body.prevPos.z = body.pos.z;
        }
        if (body.pos.x < x1) {
          x1 = body.pos.x;
        }
        if (body.pos.x > x2) {
          x2 = body.pos.x;
        }
        if (body.pos.y < y1) {
          y1 = body.pos.y;
        }
        if (body.pos.y > y2) {
          y2 = body.pos.y;
        }
        if (body.pos.z < z1) {
          z1 = body.pos.z;
        }
        if (body.pos.z > z2) {
          z2 = body.pos.z;
        }
      }

      boundingBox.x1 = x1;
      boundingBox.x2 = x2;
      boundingBox.y1 = y1;
      boundingBox.y2 = y2;
      boundingBox.z1 = z1;
      boundingBox.z2 = z2;
    }
  },
  createQuadTree: quadtree
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

var PLANET_DENSITY = 0.1;

export default {
  createParticle: function (pos, radius, density) {
    var volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
    var mass = volume * density;
    console.log(mass);
    return new Particle(pos, mass, sim);
  },
  tick: function (particles) {
    sim.step();
  }
}