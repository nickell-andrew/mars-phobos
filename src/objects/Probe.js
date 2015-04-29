import THREE from 'three';
import Physics from '../ngraph-physics.js';
import CelestialBody from './CelestialBody';


class Probe extends CelestialBody {
  constructor() {
    var radius = 0.000002;
    var material = new THREE.Material({
      color: 0x999999, 
      shininess: .000000000001
    });
    super(radius, material);
  }
  update() {
  }
}

export default Probe;