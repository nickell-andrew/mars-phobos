// adapted from https://jsfiddle.net/24mg6ctg/12/
// this might be a better source for a 3D simulation: https://github.com/stefano-meschiari/WhenGiantsCollide


var gravity = 0.5;

var Vector = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

Vector.prototype = { // typeof VAR === "object" | VAR instanceof Vector
    constructor: Vector,

    set: function (set) {
        if (typeof set === "object") {
            this.x = set.x;
            this.y = set.y;
        } else {
            this.x = set;
            this.y = set;
        }

        return this;
    },

    equals: function (v) {
        return ((v.x === this.x) && (v.y === this.y));
    },

    clone: function () {
        return new Vector(this.x, this.y);
    },

    mul: function (mul) {
        if (typeof mul === "object") {
            return new Vector(this.x * mul.x, this.y * mul.y);
        } else {
            return new Vector(this.x * mul, this.y * mul);
        }
    },

    div: function (div) {
        return new Vector(this.x / div, this.y / div);
    },

    add: function (add) {
        if (typeof add === "object") {
            return new Vector(this.x + add.x, this.y + add.y);
        } else {
            return new Vector(this.x + add, this.y + add);
        }
    },

    sub: function (sub) {
        if (typeof sub === "object") {
            return new Vector(this.x - sub.x, this.y - sub.y);
        } else {
            return new Vector(this.x - sub, this.y - sub);
        }
    },

    reverse: function () {
        return this.mul(-1);
    },

    abs: function () {
        return new Vector(Math.abs(this.x), Math.abs(this.y));
    },

    dot: function (v) {
        return (this.x * v.x + this.y * v.y);
    },

    length: function () {
        return Math.sqrt(this.dot(this));
    },

    lengthSq: function () {
        return this.dot(this);
    },

    setLength: function (l) {
        return this.normalize().mul(l);
    },

    lerp: function (v, s) {
        return new Vector(this.x + (v.x - this.x) * s, this.y + (v.y - this.y) * s);
    },

    normalize: function () {
        return this.div(this.length());
    },

    truncate: function (max) {
        if (this.length() > max) {
            return this.normalize().mul(max);
        } else {
            return this;
        }
    },

    dist: function (v) {
        return Math.sqrt(this.distSq(v));
    },

    distSq: function (v) {
        var dx = this.x - v.x,
            dy = this.y - v.y;
        return dx * dx + dy * dy;
    },

    cross: function (v) {
        return this.x * v.y - this.y * v.x;
    }
};

if (typeof Math.sign == "undefined") {
    Math.sign = function (x) {
        return x === 0 ? 0 : x > 0 ? 1 : -1;
    };
}




var Particle = function (c, r, cor, cof) { // Fix CoR & CoF
    this.c = c;
    this.r = r;
    this.m = r * r * Math.PI;
    this.v = new Vector();
    this.a = new Vector();
    this.cor = cor;
    this.cof = cof;
};

Particle.prototype.getPosition = function () {
  return {
    x: this.c.x,
    y: this.c.y,
    z: 0
  }
}

Particle.prototype.setPosition = function (pos) {
  this.c.x = pos.x;
  this.c.y = pos.y;
}

function checkCCCol(a, b) {
    var d = a.c.sub(b.c);
    var r = a.r + b.r;
    if (d.lengthSq() < r * r) {
        return true;
    } else {
        return false;
    }
}

function resCCCol(a, b) {
    var d = a.c.sub(b.c);

    d.set(d.normalize());

    var v = b.v.sub(a.v);

    var dot = d.dot(v);

    if (dot >= 0) {
        var tm = a.m + b.m;

        var c = d.mul(2 * dot / tm);



        a.v.set(a.v.add(c.mul(b.m)));
        b.v.set(b.v.sub(c.mul(a.m)));
    }
}


function compute_forces(particles) {
    for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.a.set(0);

        for (var j = 0; j < i; j++) {
            var p2 = particles[j];

            var d = p.c.sub(p2.c);
            var norm = Math.sqrt(100.0 + d.lengthSq());
            var mag = gravity / (norm * norm * norm);

            p.a.set(p.a.sub(d.mul(mag * p2.m)));
            p2.a.set(p2.a.add(d.mul(mag * p.m)));

        }
    }

}

function do_collisions(particles) {
    for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        for (var j = 0; j < i; j++) {
            var p2 = particles[j];

            if (checkCCCol(p, p2)) {
                resCCCol(p, p2);
            }
        }
    }
}

function do_physics(dt, particles) {
    for (var i1 = 0; i1 < particles.length; i1++) {
        var p1 = particles[i1];
        p1.c.set(p1.c.add(p1.v.mul(0.5 * dt)));
    }
    compute_forces(particles);
    for (var i2 = 0; i2 < particles.length; i2++) {
        var p2 = particles[i2];
        p2.v.set(p2.v.add(p2.a.mul(dt)));
    }
    for (var i3 = 0; i3 < particles.length; i3++) {
        var p3 = particles[i3];
        p3.c.set(p3.c.add(p3.v.mul(0.5 * dt)));
    }
    do_collisions(particles);
}  

export default {
  createParticle: function (pos, radius) {
    radius = radius | Math.random() * 10 + 15;
    return new Particle(new Vector(pos.x,pos.y), radius, 0.95, 0.95);
  },
  tick: function (particles) {
    for (var k = 0; k < 4; k++) { // increase the greater than value to increase simulation step rate
        do_physics(1.0 / 8, particles); // increase the divisor to increase accuracy and decrease simulation speed 
    }
  }
}