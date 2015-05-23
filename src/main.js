import Scene from './scene.js';
import THREE from 'three';

var scene, gui;

$(document).ready(init);

function init(){
  scene = new Scene(window.innerWidth, window.innerHeight);
  $('.three').append(scene.renderer.domElement);
  window.dbg.scene = scene;
  window.dbg.launch = function (v) { scene.launchProbe(scene.planet, v) };
  
  //gui = new dat.GUI();
  //gui.close();

  $( "#controls" ).draggable().hide();

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