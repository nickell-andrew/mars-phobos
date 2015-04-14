import Scene from './scene.js';
import THREE from 'three';

var scene, gui;

$(document).ready(init);

function init(){
  scene = new Scene(window.innerWidth, window.innerHeight);
  $('.three').append(scene.renderer.domElement);
  window.lion.scene = scene;
  
  gui = new dat.GUI();
  gui.close();

  $(window).on('resize', resizeHandler);
  lion.initThis = this;
  console.log("this is " + this);
  $('#update').on('click', function () {window.lion.scene.setPlanetFrequenciesFromDOM()});
  animate();  
}


function resizeHandler() {
  scene.resize(window.innerWidth, window.innerHeight);
}

function animate(milliseconds) {
  requestAnimationFrame(animate);
  scene.render(milliseconds);

}