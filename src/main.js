import Scene from './scene.js';
import THREE from 'three';

var scene, gui;

$(document).ready(init);

function init(){
  scene = new Scene(window.innerWidth, window.innerHeight);
  $('.three').append(scene.renderer.domElement);
  window.lion.scene = scene;
  window.lion.launch = function (v) { lion.scene.launchProbe(lion.scene.planet, v) }
  
  //gui = new dat.GUI();
  //gui.close();

  $( "#controls" ).draggable();

  $(window).on('resize', resizeHandler);
  $('#update').on('click', function () {
    scene.setPlanetFrequenciesFromDOM();
  });
  animate();  
}


function resizeHandler() {
  scene.resize(window.innerWidth, window.innerHeight);
}

function animate(milliseconds) {
  requestAnimationFrame(animate);
  scene.render(milliseconds);

}